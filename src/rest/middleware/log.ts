import { configure, getLogger } from 'log4js'
import { Middleware } from 'koa'
const logger = getLogger()
logger.level = 'debug'


const log = (): Middleware => {
  return async (ctx, next) => {
    logger.debug(ctx.req.url, ctx.req.method, ctx.res.statusCode)
    await next()
  }
}

export default log

