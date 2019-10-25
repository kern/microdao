import * as path from 'path'
import { Server } from 'http'
import Koa from 'koa'
import stoppable from 'stoppable'
import { ApolloServer, SchemaError } from 'apollo-server-koa'
import { GraphQLSchema, GraphQLError, GraphQLFormattedError } from 'graphql'
import { buildSchema } from 'type-graphql'
import Service from '../lib/Service'
import config from '../config'
import log from '../lib/logger'
import resolvers from '../resolvers'
import { authChecker } from '../lib/auth'
import { createContext } from '../context'

class HttpService extends Service {
  private app!: Koa
  private server!: Server
  private graphqlServer!: ApolloServer

  buildSchema(): Promise<GraphQLSchema> {
    try {
      return buildSchema({
        authChecker,
        emitSchemaFile: path.resolve(__dirname, '..', 'schema.gql'),
        resolvers,
      })
    } catch (err) {
      throw new SchemaError('unable to build schema')
    }
  }

  async start(): Promise<void> {
    super.start()

    this.app = new Koa()

    const schema = await this.buildSchema()

    this.graphqlServer = new ApolloServer({
      schema,
      introspection: true,
      context: createContext(),
      formatError: this.formatError,
    })
    this.graphqlServer.applyMiddleware({ app: this.app })

    this.server = stoppable(
      this.app.listen({ port: config.port }, () => {
        log.info(
          `🚀 Server ready at http://localhost:${config.port}${this.graphqlServer.graphqlPath}`,
        )
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/require-await, require-await
  async stop(): Promise<void> {
    super.stop()
    this.server.close()
  }

  getServer(): Server {
    return this.server
  }

  getGraphqlServer(): ApolloServer {
    return this.graphqlServer
  }

  private readonly formatError = (err: GraphQLError): GraphQLFormattedError => {
    log.error(err)
    return {
      message: err.message,
      extensions: err.extensions,
    }
  }
}

const instance = new HttpService()

export { HttpService }

export default instance
