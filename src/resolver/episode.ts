import { IResolvers } from '@graphql-tools/utils'

export const episodeQueries: IResolvers = {
  episode(parent, args, context, info) {
    console.log(args.e)
    return args.e
  },
}
