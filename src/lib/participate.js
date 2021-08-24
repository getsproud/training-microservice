import Training from '../models/training'

const participate = call => new Promise((resolve, reject) => {
  const {
    training,
    employee,
    remove,
    ticket
  } = call.query

  const message = {
    domain: 'training',
    i18n: 'TRAINING_PARTICIPATE_FAILURE',
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

    if (!remove && t.participants.find(p => p.participant.toString() === employee) !== undefined) {
      message.i18n = 'TRAINING_ALREADY_PARTICIPATING'
      message.data = t
      message.code = 400

      return reject(message)
    }

    if (!remove && (Number.isInteger(t.spots) && t.spots > t.participants.length)) {
      t.participants.push({
        participant: employee,
        bookedAt: new Date(),
        ticket
      })

      return t.save(err => {
        if (err) {
          message.error = err
          return reject(message)
        }

        message.i18n = 'TRAINING_PARTICIPATE_SUCCESS'
        message.data = t
        message.code = 200

        return resolve(message)
      })
    }

    if (remove) {
      t.participants = t.participants.filter(p => p.participant.toString() !== employee)

      return t.save(err => {
        if (err) {
          message.error = err
          return reject(message)
        }
        
        message.i18n = 'TRAINING_UNPARTICIPATE_SUCCESS'
        message.data = t
        message.code = 200

        return resolve(message)
      })
    }

    message.data = t
    message.error = 'TRAINING_SPOTS_FULL'
    message.i18n = message.error
    message.code = 403

    return reject(message)
  })
})

export default participate
