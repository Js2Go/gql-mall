import { IResolvers } from '@graphql-tools/utils'

import { mapSchema } from '../util/mapSchema'
import getSchema from '../gql'

import { scalarResolvers } from './scalar'
import { interfaceResolvers } from './interface'
import { unionResolvers } from './union'

import { bookQueries } from './book'
import { createMutations, createSubscriptions } from './create'
import { dateQueries } from './date'
import { episodeQueries } from './episode'
import { helloQueries } from './hello'
import { heroQueries } from './hero'
import { movieQueries } from './movie'
import { peopleQueries } from './people'
import { searchQueries } from './search'
import { uploadMutations } from './upload'
import { userQueries, userMutations } from './user'

const Query = {
  ...bookQueries,
  ...dateQueries,
  ...episodeQueries,
  ...helloQueries,
  ...heroQueries,
  ...movieQueries,
  ...peopleQueries,
  ...searchQueries,
  ...userQueries,
}

const Mutation = {
  ...createMutations,
  ...userMutations,
  ...uploadMutations,
}

const Subscription = {
  ...createSubscriptions
}

const resolvers: IResolvers = {
  ...scalarResolvers,
  ...interfaceResolvers,
  ...unionResolvers,
  Query,
  Mutation,
  Subscription,
}

const getSchemaWithResolvers = async () => {
  const schema = await getSchema()
  return mapSchema(schema, resolvers)
}

export default getSchemaWithResolvers
