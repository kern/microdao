import { Connection, createConnection, ConnectionOptions } from 'typeorm'
import Service from '../lib/Service'
import config from '../config'

class DatabaseService extends Service {
  connection: Connection

  async start(): Promise<void> {
    super.start()

    this.connection = await createConnection(
      config.database as ConnectionOptions,
    )
  }

  async stop(): Promise<void> {
    super.stop()
    if (this.connection) {
      await this.connection.close()
    }
  }

  getConnection(): Connection {
    return this.connection
  }
}

const instance = new DatabaseService()

export { DatabaseService }

export default instance
