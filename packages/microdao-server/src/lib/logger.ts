import config from '../config'

class Logger {
  info(message: string): void {
    if (config.env !== 'test') {
      // eslint-disable-next-line no-console
      console.log(message)
    }
  }

  error(err: Error): void {
    if (config.env !== 'test') {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }
}

const instance = new Logger()

export default instance
