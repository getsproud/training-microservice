import { Responder } from 'cote'
import mongoose from 'mongoose'

import findBy from './lib/findBy'
import findAllBy from './lib/findAllBy'
import createTraining from './lib/createTraining'
import deleteTraining from './lib/deleteTraining'
import updateTraining from './lib/updateTraining'
import participate from './lib/participate'
import updateCategories from './lib/updateCategories'
import updateDepartments from './lib/updateDepartments'
import getRecommended from './lib/getRecommended'

const PORT = 50051

const init = () => {
  mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@sproud-cluster${process.env.NODE_ENV !== 'production' ? '-dev' : ''}${process.env.MONGO_HOST}/sproud${process.env.NODE_ENV !== 'production' ? '-dev' : ''}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  const responder = new Responder({
    name: 'Training Service', port: PORT, key: 'training'
  })

  responder.on('findBy', findBy)
  responder.on('findAllBy', findAllBy)
  responder.on('createTraining', createTraining)
  responder.on('deleteTraining', deleteTraining)
  responder.on('updateTraining', updateTraining)
  responder.on('participate', participate)
  responder.on('updateDepartments', updateDepartments)
  responder.on('updateCategories', updateCategories)
  responder.on('getRecommended', getRecommended)

  // eslint-disable-next-line
  console.log(`🤩 Training Microservice bound to port ${PORT}`)

  return { mongoose, responder }
}

module.exports = init
