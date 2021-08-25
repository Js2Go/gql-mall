import { IResolvers } from '@graphql-tools/utils'
import { Sequelize } from 'sequelize/types'
import user from '../model/user'
import { IUser } from '../model/user'
import { IRegisteArg, register as registerService } from '../service/user'

interface IUserInput {
  username: string
  password: string
}

export interface IRegisterInfo {
  code: number
  msg: string
}

type withDb = IResolvers<any, { db: Sequelize }>

export const userQueries: withDb = {
  async me(parent, args, context, info): Promise<IUser | null> {
    const u = await user(context.db)
    const users = await u.findByPk(4)
    return users
  },
}

export const userMutations: withDb = {
  login(parent, args: { user: IUserInput }, context, info) {
    if (args.user.username === 'mazi' && args.user.password === '123') {
      return {
        username: 'mazi',
        token: `mazi's token can you understand`
      }
    }
  },
  async register(parent, args: { info: IRegisteArg }, context, info): Promise<IRegisterInfo> {
    return registerService(context.db, args.info)
  },
}
