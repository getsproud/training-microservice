import Training from '../models/training'
import Recommendations from '../models/recommendations'

const getRecommended = call => new Promise((resolve, reject) => {
  const { query, options, useResolve } = call

  const message = {
    domain: 'training',
    i18n: 'TRAININGS_ERROR',
    data: [],
    code: 500,
    stack: null,
    error: null
  }

  query.fromDate = !query.fromDate ? { $gte: new Date() } : query.fromDate

  const opts = {
    page: 1,
    limit: 12,
    pagination: true,
    ...options
  }

  Recommendations.find({ categories: query.categories }).then(recommended => {
    const ids = recommended.map(r => r._id)

    Training.find({ _id: ids }).then(recommendedTrainings => {
      Training.find(query).exec().then(trainings => {
        const docs = [...trainings, ...recommendedTrainings]
        const pages = opts.limit > 0 ? Math.ceil(docs.length / opts.limit) || 1 : null
        const page = parseInt(opts.page, 10) < 1 ? 1 : parseInt(opts.page, 10)
        const skip = (page - 1) * opts.limit

        const meta = {
          totalDocs: docs.length,
          ...opts
        }

        meta.limit = 0
        meta.totalPages = 1
        meta.page = 1
        meta.pagingCounter = 1
        meta.prevPage = null
        meta.nextPage = null
        meta.hasPrevPage = false
        meta.hasNextPage = false

        if (opts.limit !== 0) {
          meta.totalPages = pages
          meta.pagingCounter = (page - 1) * opts.limit + 1
          meta.page = page
          meta.limit = opts.limit

          if (page > 1) {
            meta.hasPrevPage = true
            meta.prevPage = page - 1
          }

          if (page < pages) {
            meta.hasNextPage = true
            meta.nextPage = page + 1
          }
        }

        let data = {}

        if (!opts.pagination)
          data.docs = docs
        else {
          data = {
            ...meta
          }
          data.docs = (opts.limit ? docs.slice(skip, skip + opts.limit) : docs)
        }

        message.data = data

        if (!docs || !docs.length) {
          message.i18n = 'TRAININGS_NOT_FOUND'
          message.code = 404

          return !useResolve ? reject(message) : resolve(message)
        }

        message.i18n = 'TRAININGS_FOUND'
        message.code = 200

        return resolve(message)
      }).catch(err => {
        message.stack = err.stack
        message.error = err.message

        return reject(message)
      })
    })
  })
})

export default getRecommended
