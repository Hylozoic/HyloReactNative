import getIsLoggedIn from './getIsLoggedIn'

describe('getIsLoggedIn', () => {
  it('is being explored', () => {
    const isLoggedIn = 'anything'
    const testProps = {
      session: {
        isLoggedIn
      }
    }
    expect(getIsLoggedIn(testProps)).toEqual(isLoggedIn)
  })
})
