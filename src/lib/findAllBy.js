import Training from '../models/training'

const findAllBy = call => new Promise((resolve, reject) => {
  const { query, options, useResolve } = call

  const message = {
    domain: 'training',
    i18n: 'TRAININGS_ERROR',
    data: [],
    code: 500,
    stack: null,
    error: null
  }

  const opts = {
    page: 1,
    limit: 12,
    pagination: true,
    ...options
  }

  Training.paginate(query, opts).then(trainings => {
    message.data = trainings

    if (!trainings.docs || !trainings.docs.length) {
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

export default findAllBy
