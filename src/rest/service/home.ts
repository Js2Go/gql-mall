import { ParameterizedContext } from 'koa'

export const serviceH = async () => {
  await console.log('eeee')
}

export const serviceHHH = async (ctx: ParameterizedContext) => {
  await console.log(ctx.params)
}

export const serviceHH = async () => {
  await console.log('maziaaa')
}
