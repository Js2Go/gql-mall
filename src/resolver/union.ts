import { IResolvers } from '@graphql-tools/utils'

export const unionResolvers: IResolvers = {
  SearchResult: {
    __resolveType(obj: any, context: any, info: any) {
      if (obj.totalCredits) {
        return 'Human'
      }
      if (obj.primaryFunction) {
        return 'Droid'
      }
      return null
    }
  },
}
