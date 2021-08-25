import { createServer } from 'http'
import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { GraphQLSchema, execute, subscribe } from 'graphql'
import { graphqlUploadKoa } from 'graphql-upload'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'

import upperDirective from '../directive/upperDirective'
import restDirective from '../directive/restDirective'
import MoviesAPI from '../datasource/movies'
import getSchemaWithResolvers from '../resolver'
import withDirectivesSchema from '../util/withDirectivesSchema'

interface ServerApp {
  server: ApolloServer
  app: Koa
}

const upper = upperDirective('upper')
const rest = restDirective('rest')

async function startApolloServer(schema: GraphQLSchema, port: number): Promise<ServerApp> {
  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      movies: new MoviesAPI()
    }),
    context: ({ ctx }) => {
      // console.log(ctx.req.headers.authorization)
    },
    cache: new BaseRedisCache({
      client: new Redis({
        host: '127.0.0.1',
        port: 6379,
        db: 2
      })
    }),
    // formatError(err) {
    //   if (err.originalError instanceof AuthenticationError) {
    //     return new Error('Different authentication error message!')
    //   }
    //   return err
    // },
  })
  await server.start()
  const app = new Koa()
  app.use(graphqlUploadKoa())
  server.applyMiddleware({ app, cors: true, bodyParserConfig: true })

  const httpServer = createServer(app.callback())

  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect(connectionParams: any, webscoket: any) {
        if (connectionParams.authorization) {
          return '牛逼'
        }
        throw new Error('Missing auth token!')
      }
    },
    { server: httpServer, path: server.graphqlPath }
  )

  new Promise((resolve: (val: void) => void) => {
    const start = (p: number) => {
      const s = httpServer.listen({ port: p }, resolve)
      s.on('error', err => {
        if (~err.message.indexOf('EADDRINUSE')) {
          p++
          start(p)
        }
      })

      s.on('listening', () => {
        console.log(`🚀 Server ready at http://localhost:${p}${server.graphqlPath}`)
      })
    }

    start(port)
  })
  return { server, app }
}

export const start = async (port: number) => {
  try {
    const schema = await getSchemaWithResolvers()
    startApolloServer(withDirectivesSchema(schema, [upper, rest]), port)
  } catch (err) {
    throw new Error(err)
  }
}
