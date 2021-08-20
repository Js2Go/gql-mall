import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'

function restDirective(directiveName: string) {
  return {
    restDirectiveTransformer: (schema: GraphQLSchema) => mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const restDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
        if (restDirective) {
          const { url } = restDirective
          fieldConfig.resolve = () => fetch(url)
          return fieldConfig
        }
      }
    }),
  }
}

export default restDirective
