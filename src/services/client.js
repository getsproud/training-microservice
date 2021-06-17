import { Requester } from 'cote'

export default class ServiceClient extends Requester {
  constructor(key) {
    super({ name: 'Training Service Requester', key, port: 50051 })
  }
}
