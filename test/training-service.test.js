import { Requester } from 'cote'
import { getObjectId } from 'mongo-seeding'

import init from '../src/main'

let mongo
let res
let requester

beforeAll(async () => new Promise(resolve => {
  const { mongoose, responder } = init()

  mongoose.connection.once('open', () => {
    mongo = mongoose
    res = responder

    requester = new Requester({
      name: 'test training requester',
      key: 'training',
      port: 50051
    })

    return resolve(true)
  })
}))

afterAll(async () => {
  await res.close()
  await mongo.connection.close()
  await requester.close()
})

it('doesnt find a training', async () => {
  await expect(requester.send({
    type: 'findBy',
    query: {
      title: 'JSConf Europe 20255',
      company: getObjectId('company-99').toString()
    }
  })).rejects.toMatchObject({
    code: 404,
    i18n: 'TRAINING_NOT_FOUND'
  })
})

it('get one training of one company', async () => {
  const training = await requester.send({
    type: 'findBy',
    query: {
      title: 'JSConf Europe 2021',
      company: getObjectId('company-1').toString()
    }
  })

  expect(training).toBeDefined()
  expect(training.data).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
})

it('get all trainings of one company', async () => {
  const trainings = await requester.send({
    type: 'findAllBy',
    query: {
      company: getObjectId('company-1').toString()
    }
  })

  expect(trainings).toBeDefined()
  expect(trainings.data).toBeDefined()
  expect(trainings.code).toBe(200)
  expect(trainings.error).toBeFalsy()
  expect(trainings.stack).toBeFalsy()
  expect(trainings.data.docs.length).toBe(3)
})

it('get all recommended trainings for one category', async () => {
  const trainings = await requester.send({
    type: 'getRecommended',
    query: {
      categories: getObjectId('cat-developemnt').toString()
    }
  })

  expect(trainings).toBeDefined()
  expect(trainings.data).toBeDefined()
  expect(trainings.code).toBe(200)
  expect(trainings.error).toBeFalsy()
  expect(trainings.stack).toBeFalsy()
  expect(trainings.data.docs.length).toBe(3)
})

it('create training for one company', async () => {
  const training = await requester.send({
    type: 'createTraining',
    query: {
      _id: getObjectId('training-9999').toString(),
      author: getObjectId('employee-1').toString(),
      company: getObjectId('company-1').toString(),
      title: 'test-training',
      spots: 0
    }
  })

  expect(training).toBeDefined()
  expect(training.data).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.data.author).toBe(getObjectId('employee-1').toString())
  expect(training.data.company).toBe(getObjectId('company-1').toString())
  expect(training.data.title).toBe('test-training')
})

it('participate at training which is full', async () => {
  await expect(requester.send({
    type: 'participate',
    query: {
      employee: getObjectId('employee-999').toString(),
      training: getObjectId('training-9999').toString(),
      remove: false
    }
  })).rejects.toMatchObject({
    code: 403,
    i18n: 'TRAINING_SPOTS_FULL'
  })
})

it('update training for one company', async () => {
  const training = await requester.send({
    type: 'updateTraining',
    query: {
      _id: getObjectId('training-9999').toString(),
      title: 'test-training-updated',
      spots: 1
    }
  })

  expect(training).toBeDefined()
  expect(training.data).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.data.author).toBe(getObjectId('employee-1').toString())
  expect(training.data.company).toBe(getObjectId('company-1').toString())
  expect(training.data.title).toBe('test-training-updated')
})

it('participate at training', async () => {
  const training = await requester.send({
    type: 'participate',
    query: {
      employee: getObjectId('employee-999').toString(),
      training: getObjectId('training-9999').toString(),
      remove: false
    }
  })

  expect(training).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.i18n).toBe('TRAINING_PARTICIPATE_SUCCESS')
})

it('check participation on training', async () => {
  await expect(requester.send({
    type: 'participate',
    query: {
      employee: getObjectId('employee-999').toString(),
      training: getObjectId('training-9999').toString(),
      remove: false
    }
  })).rejects.toMatchObject({
    code: 400,
    i18n: 'TRAINING_ALREADY_PARTICIPATING'
  })
})

it('unparticipate from training', async () => {
  const training = await requester.send({
    type: 'participate',
    query: {
      employee: getObjectId('employee-999').toString(),
      training: getObjectId('training-9999').toString(),
      remove: true
    }
  })

  expect(training).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.i18n).toBe('TRAINING_UNPARTICIPATE_SUCCESS')
})

it('update departments for training of one company', async () => {
  const training = await requester.send({
    type: 'updateDepartments',
    query: {
      training: getObjectId('training-9999').toString(),
      departments: [getObjectId('dep-dev').toString(), getObjectId('dep-mark').toString()]
    }
  })

  expect(training).toBeDefined()
  expect(training.data).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.data.departments).toStrictEqual([getObjectId('dep-dev').toString(), getObjectId('dep-mark').toString()])
})

it('update categories for training of one company', async () => {
  const training = await requester.send({
    type: 'updateCategories',
    query: {
      training: getObjectId('training-9999').toString(),
      categories: [getObjectId('cat-dev').toString(), getObjectId('cat-mark').toString()]
    }
  })

  expect(training).toBeDefined()
  expect(training.data).toBeDefined()
  expect(training.code).toBe(200)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.data.categories).toStrictEqual([getObjectId('cat-dev').toString(), getObjectId('cat-mark').toString()])
})

it('delete training for one company', async () => {
  const training = await requester.send({
    type: 'deleteTraining',
    query: {
      author: getObjectId('employee-1').toString(),
      company: getObjectId('company-1').toString(),
      title: 'test-training-updated'
    }
  })

  expect(training).toBeDefined()
  expect(training.code).toBe(204)
  expect(training.error).toBeFalsy()
  expect(training.stack).toBeFalsy()
  expect(training.i18n).toBe('TRAINING_DELETION_SUCCESS')
})
