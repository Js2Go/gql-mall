import { IResolvers } from '@graphql-tools/utils'

import { POST_CREATED } from '../constants'
import pubsub from '../util/pubsub'
import user from '../model/user'

export const createMutations: IResolvers = {
  async create(parent, args, context, info) {
    let u = await user(context.db)
    await u.create({ username: 'mazi', password: 'asdasdsa' })
    return {
      stars: ++args.ri.stars
    }
  },
  createPost(parent, args, context) {
    pubsub.publish(POST_CREATED, { postCreated: args })
    return args
  },
}

export const createSubscriptions: IResolvers = {
  postCreated: {
    subscribe: () => pubsub.asyncIterator([POST_CREATED])
  }
}
