import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'

function upperDirective(directiveName: string): (schema: GraphQLSchema) => GraphQLSchema {
  return schema => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
      if (upperDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info)
          if (typeof result === 'string') {
            return result.toUpperCase()
          }
          return result
        }
        return fieldConfig
      }
    }
  })
}

export default upperDirective
