const { RESTDataSource } = require('apollo-datasource-rest')

class MoviesAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = 'http://localhost:2021/'
  }

  willSendRequest(req) {
    req.headers.set('Authorization', this.context.token)
  }

  async getMovie(id) {
    return this.get(`movies/${id}`)
  }

  async getMostViewedMovies(limit = 10) {
    const data = await this.get('movies', {
      per_page: limit,
      order_by: 'most_viewed',
    })
    return data
  }
}

module.exports = MoviesAPI
