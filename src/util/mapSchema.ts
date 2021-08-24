import { addResolversToSchema } from '@graphql-tools/schema'
import { IResolvers } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'


export const mapSchema = (schema: GraphQLSchema, resolvers: IResolvers): GraphQLSchema => {
  return addResolversToSchema({
    schema,
    resolvers
  })
}
