import { IResolvers } from '@graphql-tools/utils'

export const movieQueries: IResolvers = {
  movie: async (_, { id }, { dataSources }) => {
    return dataSources.movies.getMovie(id)
  },
  mostViewedMovies: async (_, __, { dataSources }) => {
    return dataSources.movies.getMostViewedMovies()
  },
}
