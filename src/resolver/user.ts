import { IResolvers } from '@graphql-tools/utils'

import { user } from '../mock'

interface UserInput {
  username: string
  password: string
}

export const userQueries: IResolvers = {
  me(parent, args, context, info) {
    return user
  },
}

export const userMutations: IResolvers = {
  login(parent, args: { user: UserInput }, context, info) {
    if (args.user.username === 'mazi' && args.user.password === '123') {
      return {
        username: 'mazi',
        token: `mazi's token can you understand`
      }
    }
  },
}
