import { IResolvers } from '@graphql-tools/utils'

import { books } from '../mock'

export const bookQueries: IResolvers = {
  books(parent, args, context, info) {
    return books
  },
}
