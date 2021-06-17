import Training from '../models/training'

const updateTraining = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'training',
    i18n: 'TRAINING_UPDATE_FAILURE',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  Training.findOneAndUpdate({ _id: query._id }, query, { new: true }).then(training => {
    if (!training) {
      message.i18n = 'TRAINING_NOT_FOUND'
      message.code = 404

      return reject(message)
    }

    message.i18n = 'TRAINING_UPDATE_SUCCESS'
    message.code = 200
    message.data = training

    return resolve(message)
  }).catch(e => {
    message.stack = e.stack
    message.error = e.message

    return reject(message)
  })
})

export default updateTraining
