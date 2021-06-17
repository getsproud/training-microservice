import Training from '../models/training'

const updateCategories = call => new Promise((resolve, reject) => {
  const { training, categories, remove } = call.query

  const message = {
    domain: 'training',
    i18n: 'TRAINING_UPDATE_FAILURE',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  Training.findOne({ _id: training }).exec().then(t => {
    if (!t) {
      message.i18n = 'TRAINING_NOT_FOUND'
      message.code = 404

      return reject(message)
    }

    if (!remove)
      t.categories.push(...categories)
    else
      t.categories = t.categories.filter(c => categories.indexOf(c) === -1)

    return t.save(() => {
      message.i18n = 'TRAINING_UPDATE_SUCCESS'
      message.data = t
      message.code = 200

      return resolve(message)
    })
  })
})

export default updateCategories
