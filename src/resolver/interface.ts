import { IResolvers } from '@graphql-tools/utils'

export const interfaceResolvers: IResolvers = {
  Book: {
    __resolveType(book: any, context: any, info: any){
      // Only Textbook has a courses field
      if(book.courses){
        return 'Textbook';
      }
      // Only ColoringBook has a colors field
      if(book.colors){
        return 'ColoringBook';
      }
      return null; // GraphQLError is thrown
    },
  },
  Character: {
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
