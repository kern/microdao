import 'reflect-metadata'
import * as dotenv from 'dotenv'

// eslint-disable-next-line no-process-env
switch (process.env.NODE_ENV) {
  case 'test':
    dotenv.config({ path: '.env.test' })
    break
  default:
    dotenv.config()
    break
}
