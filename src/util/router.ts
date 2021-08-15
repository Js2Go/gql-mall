import { ParameterizedContext } from 'koa'
import Router, { RouterOptions, Middleware } from '@koa/router'

export const wrapper: (ff: (c: ParameterizedContext) => Promise<unknown>) => Middleware = f => {
  return async (ctx, next) => {
    await f(ctx)
    await next()
  }
}

class mRouter extends Router {
  constructor(opts?: RouterOptions) {
    super(opts)
  }

  mGet(path: string, f: (c: ParameterizedContext) => Promise<unknown>) {
    super.get(path, wrapper(f))
  }

  mPost(path: string, f: (c: ParameterizedContext) => Promise<unknown>) {
    super.post(path, wrapper(f))
  }
}

export default mRouter
