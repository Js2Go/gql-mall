import Koa from 'koa'
import cors from '@koa/cors'
import log from './middleware/log'
import homeRoute from './router/home'

const app = new Koa()
const PORT = 2021

app
  .use(cors())
  .use(homeRoute.routes()).use(homeRoute.allowedMethods())
  .use(log())

const runServer = (port: number): (p: number) => void => {
  const start = (p: number) => {
    const server = app.listen(p, () => {
      console.log(`server listening port at ${p}`)
    })

    server.on('error', err => {
      if (~err.message.indexOf('EADDRINUSE')) {
        port++
        console.log(`server port ${PORT} is used, now using port ${port}`)
        start(port)
      }
    })
  }

  start(port)

  return start
}

runServer(PORT)
