import Koa from 'koa'
import { ApolloServer, gql } from 'apollo-server-koa'
import { DocumentNode } from 'graphql'

const PORT = 8899

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
]

const resolvers = {
  Query: {
    books: () => books,
  },
}

interface AS {
  server: ApolloServer
  app: Koa
}

async function startApolloServer(typeDefs: DocumentNode, resolvers: any, port: number): Promise<AS> {
  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  const app = new Koa()
  server.applyMiddleware({ app, cors: true, bodyParserConfig: true })
  await new Promise((resolve: (val: void) => void) => {
    const start = (p: number) => {
      const s = app.listen({ port: p }, resolve)
      s.on('error', err => {
        if (~err.message.indexOf('EADDRINUSE')) {
          p++
          console.log(`server port ${p} is used, now using port ${p}`)
          console.log(`🚀 Server ready at http://localhost:${p}${server.graphqlPath}`)
          startApolloServer(typeDefs, resolvers, p)
        }
      })
    }

    start(port)
  })
  return { server, app }
}

startApolloServer(typeDefs, resolvers, PORT)
