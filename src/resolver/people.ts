import { IResolvers } from '@graphql-tools/utils'

export const peopleQueries: IResolvers = {
  people(parent, args, context, info) {
    return 'people'
  },
}
