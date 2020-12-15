import getRouteParam from './getRouteParam'

describe('getRouteParam', () => {
  it('returns the expected result', () => {
    const myParam = 'testaccesscode'
    const route = {
      params: {
        myParam
      }
    }
    expect(getRouteParam('myParam', route)).toEqual(myParam)
  })
})
