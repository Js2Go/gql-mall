import { IResolvers } from '@graphql-tools/utils'
import { IUser } from '../model/user'
import user from '../model/user'

interface UserInput {
  username: string
  password: string
}

export const userQueries: IResolvers = {
  async me(parent, args, context, info): Promise<IUser | null> {
    const u = await user(context.db)
    const users = await u.findByPk(4)
    return users
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
