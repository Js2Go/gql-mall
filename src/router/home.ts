import Router from '../util/router'
import { h, hh, hhh } from '../controller/home'

const homeRoute = new Router({ prefix: '/movies' })

homeRoute.mGet('/', h)
homeRoute.mGet('/:id', hhh)

homeRoute.mPost('/mazi', hh)

export default homeRoute
