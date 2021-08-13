import Router, { wrapper } from '../router'

describe('test the router util', () => {
  it('first case', () => {
    const r = new Router({ prefix: '/home' })

    const data = {'methods': ['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE'], 'opts': {'prefix': '/home'}, 'params': {}, 'stack': []}

    expect(r).toEqual(data)
  })

  // it('test wrapper', () => {
  //   const eff = async () => {
  //     await console.log('asdasd')
  //   }
  
  //   const f = wrapper(eff)
  //   expect(f).toBeCalledWith(eff)
  // })
})
