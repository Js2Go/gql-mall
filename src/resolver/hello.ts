import { IResolvers } from '@graphql-tools/utils'

export const helloQueries: IResolvers = {
  hello(parent, args, context, info) {
    return 'hello'
  },
}
