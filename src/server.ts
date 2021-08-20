import { join } from 'path'

import Koa from 'koa'
import { ApolloServer } from 'apollo-server-koa'
import { GraphQLScalarType, GraphQLSchema, Kind } from 'graphql'
import { IResolvers } from '@graphql-tools/utils'
import { graphqlUploadKoa } from 'graphql-upload'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema, makeExecutableSchema } from '@graphql-tools/schema'
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground'

import upperDirective from './directive/upperDirective'
import restDirective from './directive/restDirective'

import MoviesAPI from './datasource/movies'

const upper = upperDirective('upper')
const { restDirectiveTransformer } = restDirective('rest')

const PORT = 8899

const getTypeDefs = async () => {
  return await loadSchema(join(__dirname, 'gql/*.gql'), {
    loaders: [new GraphQLFileLoader()],
  })
}

const user = {
  id: 1,
  name: 'mazi'
}

const hero = {
  name: 'mazi',
  friends: [
    {
      name: 'haozi',
      friends: []
    },
    {
      name: 'kaizi',
      friends: []
    },
    {
      name: 'wangzi',
      friends: []
    },
    {
      name: 'dengzi',
      friends: []
    },
  ]
}

const searchRes = [
  {
    id: 1,
    name: 'mazi',
    totalCredits: 1
  },
  {
    id: 1111,
    name: 'mazi1111',
    primaryFunction: "1111"
  },
]

const books = [
  {
    title: 'title1',
    author: {
      name: 'authorname1'
    },
    courses: [
      {
        name: 'coursesname1'
      },
      {
        name: 'coursesname2'
      },
    ]
  },
  {
    title: 'title2',
    author: {
      name: 'authorname2'
    },
    colors: ['colors1', 'colors2']
  },
]

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  // Serializes an internal value to include in a response.
  serialize(val: Date) {
    console.log('s', val)
    return val.getTime()
  },
  // Parses an externally provided value to use as an input.
  parseValue(val) {
    console.log('p', val)
    return new Date(val)
  },
  // Parses an externally provided literal value to use as an input.
  parseLiteral(ast) {
    console.log('pl', (ast as any).value)
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

const resolvers: IResolvers = {
  Date: dateScalar,
  Character: {
    __resolveType(obj: any, context: any, info: any) {
      if (obj.totalCredits) {
        return 'Human'
      }
      if (obj.primaryFunction) {
        return 'Droid'
      }
      return null
    }
  },
  SearchResult: {
    __resolveType(obj: any, context: any, info: any) {
      if (obj.totalCredits) {
        return 'Human'
      }
      if (obj.primaryFunction) {
        return 'Droid'
      }
      return null
    }
  },
  Book: {
    __resolveType(book: any, context: any, info: any){
      // Only Textbook has a courses field
      if(book.courses){
        return 'Textbook';
      }
      // Only ColoringBook has a colors field
      if(book.colors){
        return 'ColoringBook';
      }
      return null; // GraphQLError is thrown
    },
  },
  Query: {
    me(parent, args, context, info) {
      return user
    },
    hero(parent, args, context, info) {
      if (args.name && ~hero.friends.findIndex(f => f.name === args.name)) {
        return { ...hero, friends: [hero.friends.find(f => f.name === args.name)] }
      }
      return hero
    },
    episode(parent, args, context, info) {
      if (args.name && ~hero.friends.findIndex(f => f.name === args.name)) {
        return { ...hero, friends: [hero.friends.find(f => f.name === args.name)] }
      }
      return hero
    },
    search(parent, args, context, info) {
      return searchRes
    },
    books(parent, args, context, info) {
      return books
    },
    characters(parent, args, context, info) {
      return searchRes
    },
    date(parent, args, context, info) {
      return new Date()
    },
    getDate(parent, args, context, info) {
      return args.d
    },
    async hello(parent, args, context, info) {
      const data = await context.dataSources.movies.getMovie(1)
      return data.name
    },
    people(parent, args, context, info) {
      return 'hello'
    },
  },
  Mutation: {
    create(parent, args, context, info) {
      console.log(args)
      return {
        stars: ++args.ri.stars
      }
    }
  }
}

interface ServerApp {
  server: ApolloServer
  app: Koa
}

async function startApolloServer(schema: GraphQLSchema, port: number): Promise<ServerApp> {
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({})
    ],
    dataSources: () => ({
      movies: new MoviesAPI()
    })
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
  schema = addResolversToSchema({
    schema,
    resolvers
  })
  schema = restDirectiveTransformer(upper(makeExecutableSchema({
    typeDefs: schema,
  })))
  startApolloServer(schema, PORT)
})
