import { join } from 'path'

import Koa from 'koa'
import { ApolloServer, AuthenticationError, gql, UserInputError } from 'apollo-server-koa'
import { DocumentNode, GraphQLScalarType, Kind } from 'graphql'
import { IResolvers } from '@graphql-tools/utils'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import Redis from 'ioredis'
import { GraphQLUpload, graphqlUploadKoa } from 'graphql-upload'
import promises from 'stream/promises'
import { GraphQLSchemaModule } from 'apollo-server-core'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

// import MoviesAPI from './datasource/movies'
// import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground'

// import upperDirective from './directive/upperDirective'

// const { upperDirectiveTypeDefs, upperDirectiveTransformer } = upperDirective('upper')
// const { upperDirectiveTypeDefs: upperCaseDirectiveTypeDefs, upperDirectiveTransformer: upperCaseDirectiveTransformer } = upperDirective('upperCase')

const PORT = 8899

const typeDefs = loadSchemaSync(join(__dirname, 'gql/*.gql'), {
  loaders: [new GraphQLFileLoader()]
})


// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   "Description for the type"
//   type Book {
//     """
//     Description for field
//     Supports **multi-line** description for your [API](http://example.com)!
//     """
//     title: String
//     publishData: Date
//     author: String
//     oldTitle: String @deprecated(reason: "Use \`title\`")
//   }

//   scalar Date

//   scalar Odd

//   scalar Upload

//   directive @withDeprecatedArgs(
//     deprecatedArg: String @deprecated(reason: "Use \`newArg\`"),
//     newArg: String
//   ) on FIELD

//   type File {
//     filename: String!
//     mimetype: String!
//     encoding: String!
//   }

//   type MyType {
//     # ARGUMENT_DEFINITION (alternate example on a field's args)
//     # fieldWithDeprecatedArgs(name: String! @deprecated): String // this is an error example
//     fieldWithDeprecatedArgs(name: String @deprecated): String
//     # FIELD_DEFINITION
//     deprecatedField: String @deprecated
//   }

//   enum MyEnum {
//     # ENUM_VALUE
//     OLD_VALUE @deprecated(reason: "Use \`NEW_VALUE\`.")
//     NEW_VALUE
//   }

//   input SomeInputType {
//     nonDeprecated: String
//     # INPUT_FIELD_DEFINITION
//     deprecated: String @deprecated
//   }

//   type Movie {
//     name: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//     echoOdd(odd: Odd!): Odd!
//     # movie(id: Int!): Movie
//     # mostViewedMovies: [Movie]
//     otherFields: Boolean!
//   }

//   type Mutation {
//     singleUpload(file: Upload!): File!
//   }
// `

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

const modules: GraphQLSchemaModule[] = [
  {
    typeDefs,
    resolvers: {},
  }
]

async function startApolloServer(typeDefs: DocumentNode, resolvers: IResolvers, port: number): Promise<ServerApp> {
  const server = new ApolloServer({
    modules,
    // typeDefs,
    // resolvers,
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
    // plugins: [
    //   ApolloServerPluginLandingPageGraphQLPlayground({})
    // ]
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

startApolloServer(typeDefs, resolvers, PORT)
