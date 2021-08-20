import { join } from 'path'

import Koa from 'koa'
import { ApolloServer, AuthenticationError, UserInputError } from 'apollo-server-koa'
import { GraphQLScalarType, GraphQLSchema, Kind } from 'graphql'
import { IResolvers } from '@graphql-tools/utils'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import { GraphQLUpload, graphqlUploadKoa } from 'graphql-upload'
import promises from 'stream/promises'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

import MoviesAPI from './datasource/movies'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground'
import { addResolversToSchema } from '@graphql-tools/schema'

// import upperDirective from './directive/upperDirective'

// const { upperDirectiveTypeDefs, upperDirectiveTransformer } = upperDirective('upper')
// const { upperDirectiveTypeDefs: upperCaseDirectiveTypeDefs, upperDirectiveTransformer: upperCaseDirectiveTransformer } = upperDirective('upperCase')

const PORT = 8899

const getTypeDefs = async () => {
  return await loadSchema(join(__dirname, 'gql-back/*.gql'), {
    loaders: [new GraphQLFileLoader()]
  })
}

function oddValue(value: number) {
  if (typeof value === 'number' && Number.isInteger(value) && value % 2 !== 0) {
    return value
  }
  throw new UserInputError(`Provided value is not an odd integer`)
}

const books = [
  {
    title: 'The Awakening',
    publishData: new Date(),
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    publishData: new Date(),
    author: 'Paul Auster',
  },
]

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'This is the Date type',
  serialize(value: Date) {
    return value.getTime()
  },
  parseValue(value) {
    return new Date(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

const oddScalar = new GraphQLScalarType({
  name: 'Odd',
  description: 'Odd custom scalar type',
  parseValue: oddValue,
  serialize: oddValue,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return oddValue(parseInt(ast.value, 10))
    }
    throw new UserInputError(`Provided value is not an odd integer`)
  }
})

const resolvers: IResolvers = {
  Date: dateScalar,
  Odd: oddScalar,
  Upload: GraphQLUpload,
  Query: {
    books: () => books,
    echoOdd(parent, args, context, info) {
      return args.odd
    },
    // movie: async (_, { id }, { dataSources }) => {
    //   console.log(dataSources)
    //   return dataSources.moviesAPI.getMovie(id)
    // },
    // mostViewedMovies: async (_, __, { dataSources }) => {
    //   return dataSources.moviesAPI.getMostViewedMovies()
    // },
  },
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file
      const stream = createReadStream()
      const out = (await import('fs')).createWriteStream(filename)
      stream.pipe(out)
      await promises.finished(out)

      return { filename, mimetype, encoding }
    }
  }
}

interface ServerApp {
  server: ApolloServer
  app: Koa
}


async function startApolloServer(schema: GraphQLSchema, resolvers: IResolvers, port: number): Promise<ServerApp> {
  const schemaWithResolvers = addResolversToSchema({
    schema,
    resolvers
  })
  const server = new ApolloServer({
    schema: schemaWithResolvers,
    cache: new BaseRedisCache({
      client: new Redis({
        host: '127.0.0.1',
        port: 6379,
        db: 2
      })
    }),
    formatError(err) {
      if (err.originalError instanceof AuthenticationError) {
        return new Error('Different authentication error message!')
      }
      return err
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({})
    ],
    // ts-node has a bug need to fix, so I can't use dataSources option
    // dataSources: () => {
    //   return {
    //     moviesAPI: new MoviesAPI(),
    //   }
    // },
  })
  await server.start()
  const app = new Koa()
  app.use(graphqlUploadKoa())
  server.applyMiddleware({ app, cors: true, bodyParserConfig: true })
  await new Promise((resolve: (val: void) => void) => {
    const start = (p: number) => {
      const s = app.listen({ port: p }, resolve)
      s.on('error', err => {
        if (~err.message.indexOf('EADDRINUSE')) {
          p++
          // console.log(`server port ${port} is used, now using port ${p}`)
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

getTypeDefs().then(schema => {
  startApolloServer(schema, resolvers, PORT)
})
