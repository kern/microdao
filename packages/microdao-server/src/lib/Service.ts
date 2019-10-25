import log from './logger'

export default class Service {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(opts?: any): void {
    log.info(`>>> Starting ${this.constructor.name}`)
  }

  stop(): void {
    log.info(`>>> Stopping ${this.constructor.name}`)
  }
}
