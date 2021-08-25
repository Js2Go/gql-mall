import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLSchema } from 'graphql'

const withDirectivesSchema = (schema: GraphQLSchema, directives: Array<(schema: GraphQLSchema) => GraphQLSchema>): GraphQLSchema => {
  schema = makeExecutableSchema({
    typeDefs: schema
  })
  return directives.reduce((prev, next) => next(prev), schema)
}

export default withDirectivesSchema
