import { Middleware } from 'koa'

const cors = (): Middleware => {
  return async (ctx, next) => {
    ctx.res.setHeader('Access-Control-Allow-Origin', '*')
    ctx.res.setHeader('Access-Control-Allow-Methods', 'get, post, put, delete, head')
    await next()
  }
}

export default cors
