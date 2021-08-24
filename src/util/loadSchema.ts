import { join } from 'path'

import { loadSchema as load } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { GraphQLSchema } from 'graphql'

export const loadSchema = async (name: string): Promise<GraphQLSchema> => {
  return await load(join(__dirname, `../gql/${name}.gql`), {
    loaders: [new GraphQLFileLoader()],
  })
}
