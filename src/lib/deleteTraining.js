import Training from '../models/training'

const deleteTraining = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'training',
    i18n: 'TRAINING_DELETION_FAILURE',
    data: null,
    code: 500,
    stack: null,
    error: null
  }

  Training.findOneAndDelete(query).then(training => {
    if (!training) {
      message.i18n = 'TRAINING_NOT_FOUND'
      message.code = 404

      return reject(message)
    }

    message.i18n = 'TRAINING_DELETION_SUCCESS'
    message.code = 204

    return resolve(message)
  }).catch(e => {
    message.stack = e.stack
    message.error = e.message

    return reject(message)
  })
})

export default deleteTraining
