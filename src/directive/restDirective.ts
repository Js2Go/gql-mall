import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'
import fetch from 'node-fetch'

function restDirective(directiveName: string): (schema: GraphQLSchema) => GraphQLSchema {
  return (schema) => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const restDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
      if (restDirective) {
        const { url } = restDirective
        fieldConfig.resolve = async () => {
          const data = await fetch(url)
          const d = await data.json()
          return d[0].name
        }
        return fieldConfig
      }
    }
  })
}

export default restDirective
