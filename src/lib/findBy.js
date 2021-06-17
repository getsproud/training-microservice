import Training from '../models/training'

const findBy = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'training',
    i18n: 'TRAINING_ERROR',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  Training.findOne(query).exec().then(training => {
    message.data = training

    if (!training) {
      message.i18n = 'TRAINING_NOT_FOUND'
      message.code = 404

      return reject(message)
    }

    message.i18n = 'TRAINING_FOUND'
    message.code = 200

    return resolve(message)
  }).catch(err => {
    message.stack = err.stack
    message.error = err.message

    return reject(message)
  })
})

export default findBy
