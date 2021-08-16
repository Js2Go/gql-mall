import { ParameterizedContext } from 'koa'
import { serviceH, serviceHH, serviceHHH } from '../service/home'

export const h = async (ctx: ParameterizedContext) => {
  await serviceH()
  ctx.body = [{ message: 'hello from koa', name: 'hhhhhhhhhhhhh' }]
}

export const hhh = async (ctx: ParameterizedContext) => {
  await serviceHHH(ctx)
  ctx.body = { message: 'hello from koa', name: 'eeeeeeeeeeee' }
}

export const hh = async (ctx: ParameterizedContext) => {
  await serviceHH()
  ctx.body = { message: 'hello from koa post' }
}
