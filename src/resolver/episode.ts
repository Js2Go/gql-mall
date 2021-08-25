import { IResolvers } from '@graphql-tools/utils'

import { hero } from '../mock'

export const episodeQueries: IResolvers = {
  episode(parent, args, context, info) {
    if (args.name && ~hero.friends.findIndex(f => f.name === args.name)) {
      return { ...hero, friends: [hero.friends.find(f => f.name === args.name)] }
    }
    return hero
  },
}
