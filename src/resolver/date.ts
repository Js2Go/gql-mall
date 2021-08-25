import { IResolvers } from '@graphql-tools/utils'

export const dateQueries: IResolvers = {
  date(parent, args, context, info) {
    return new Date()
  },
  getDate(parent, args, context, info) {
    return args.d
  },
}
