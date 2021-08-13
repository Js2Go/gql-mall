import { ParameterizedContext } from 'koa'
import { serviceH, serviceHH } from '../service/home'

export const h = async (ctx: ParameterizedContext) => {
  await serviceH()
  ctx.body = { message: 'hello from koa' }
}

export const hh = async (ctx: ParameterizedContext) => {
  await serviceHH()
  ctx.body = { message: 'hello from koa post' }
}
