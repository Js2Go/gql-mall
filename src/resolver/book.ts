import { IResolvers } from '@graphql-tools/utils'

import { books } from '../mock'
import { loadSchema } from 'src/util/loadSchema'
import { mapSchema } from 'src/util/mapSchema'

const resolvers: IResolvers = {
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
  Query: {
    books(parent, args, context, info) {
      return books
    },
  },
}

const book = async () => {
  const schema = await loadSchema('book')
  return mapSchema(schema, resolvers)
}

export default book
