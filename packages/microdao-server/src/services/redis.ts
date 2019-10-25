import { promisify } from 'util'
import * as redis from 'redis'
import Service from '../lib/Service'
import config from '../config'

class RedisService extends Service {
  client: any
  get: any
  setex: any
  hset: any
  hget: any
  del: any

  // eslint-disable-next-line @typescript-eslint/require-await, require-await
  async start(): Promise<void> {
    super.start()

    this.client = redis.createClient(config.redis.url)

    this.get = promisify(this.client.get).bind(this.client)
    this.setex = promisify(this.client.setex).bind(this.client)
    this.hset = promisify(this.client.hset).bind(this.client)
    this.hget = promisify(this.client.hget).bind(this.client)
    this.del = promisify(this.client.del).bind(this.client)
  }

  // eslint-disable-next-line @typescript-eslint/require-await, require-await
  async stop(): Promise<void> {
    super.stop()
  }
}

const instance = new RedisService()

export { RedisService }

export default instance
