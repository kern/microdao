import './environment'
import { heimdall } from '@strv/heimdall'
import databaseService from './services/database'
import httpService from './services/http'
import redisService from './services/redis'

heimdall({
  async execute(): Promise<void> {
    await redisService.start()
    await databaseService.start()
    await httpService.start()
  },
  async exit(): Promise<void> {
    await httpService.stop()
    await databaseService.stop()
    await redisService.stop()
  },
  didReceiveForcequit(): void {},
})
