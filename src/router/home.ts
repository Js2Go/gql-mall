import Router from '../util/router'
import { h, hh } from '../controller/home'

const homeRoute = new Router({ prefix: '/home' })

homeRoute.mGet('/', h)

homeRoute.mPost('/mazi', hh)

export default homeRoute
