import { Sequelize } from 'sequelize'
import { IRegisterInfo } from '../resolver/user'
import generateUser from '../model/user'

export interface IRegisteArg {
  username: string
  password: string
  code: string
}

export const register = async (db: Sequelize, args: IRegisteArg): Promise<IRegisterInfo> => {
  try {
    const user = await generateUser(db)
    await user.create({ username: args.username, password: args.password })
    return {
      code: 0,
      msg: '注册成功'
    }
  } catch (err) {
    throw new Error(err)
  }
}
