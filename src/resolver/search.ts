import { IResolvers } from '@graphql-tools/utils'

import { searchRes } from '../mock'

export const searchQueries: IResolvers = {
  search(parent, args, context, info) {
    return searchRes
  },
  characters(parent, args, context, info) {
    return searchRes
  },
}
