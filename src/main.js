import { Responder } from 'cote'
import { connect } from 'mongoose'

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

const connectRetry = t => {
  let tries = t

  return connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@sproud-cluster${process.env.NODE_ENV !== 'production' ? '-dev' : ''}${process.env.MONGO_HOST}/sproud${process.env.NODE_ENV === 'development' ? '-dev' : ''}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
    .catch(e => {
      if (tries < 5) {
        tries += 1
        setTimeout(() => connectRetry(tries), 5000)
      }

      throw new Error(e)
    })
}

connectRetry(0)

try {
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

  responder.on('liveness', () => new Promise(resolve => resolve(200)))
  responder.on('readiness', () => new Promise(resolve => resolve(200)))

  // eslint-disable-next-line
  console.log(`🤩 Training Microservice bound to port ${PORT}`)
} catch (e) {
  // eslint-disable-next-line
  console.error(`${e.message}`)
}
