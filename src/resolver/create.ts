import { IResolvers } from '@graphql-tools/utils'

import { POST_CREATED } from '../constants'
import pubsub from '../util/pubsub'

export const createMutations: IResolvers = {
  create(parent, args, context, info) {
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
