import Training from '../models/training'

const updateDepartments = call => new Promise((resolve, reject) => {
  const { training, departments, remove } = call.query

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
      t.departments.push(...departments)
    else
      t.departments = t.departments.filter(d => departments.indexOf(d.toString()) === -1)

    return t.save(() => {
      message.i18n = 'TRAINING_UPDATE_SUCCESS'
      message.data = t
      message.code = 200

      return resolve(message)
    })
  })
})

export default updateDepartments
