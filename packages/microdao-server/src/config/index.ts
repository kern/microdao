import * as database from './database'
import * as redis from './redis'
import { get } from 'env-var'

export default {
  env: get('NODE_ENV', 'production').asString(),
  port: get('PORT', '4000').asPortNumber(),
  database,
  redis,
}
