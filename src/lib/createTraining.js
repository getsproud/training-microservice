import Training from '../models/training'

const createTraining = call => new Promise((resolve, reject) => {
  const { query } = call

  const message = {
    domain: 'training',
    i18n: 'TRAINING_CREATION_FAILURE',
    data: {},
    code: 500,
    stack: null,
    error: null
  }

  Training.create(query).then(training => {
    message.i18n = 'TRAINING_CREATION_SUCCESS'
    message.code = 200
    message.data = training

    return resolve(message)
  }).catch(e => {
    message.stack = e.stack
    message.error = e.message

    return reject(message)
  })
})

export default createTraining
