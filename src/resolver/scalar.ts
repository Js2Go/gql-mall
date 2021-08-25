import { IResolvers } from '@graphql-tools/utils'
import { GraphQLScalarType, Kind } from 'graphql'
import { GraphQLUpload } from 'graphql-upload'

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  // Serializes an internal value to include in a response.
  serialize(val: Date) {
    return val.getTime()
  },
  // Parses an externally provided value to use as an input.
  parseValue(val) {
    return new Date(val)
  },
  // Parses an externally provided literal value to use as an input.
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

export const scalarResolvers: IResolvers = {
  Date: dateScalar,
  Upload: GraphQLUpload,
}
