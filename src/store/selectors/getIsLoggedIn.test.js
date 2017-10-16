import getIsLoggedIn from './getIsLoggedIn'

it('gets current logged in status', () => {
  const isLoggedIn = 'anything'
  const testProps = {
    session: {
      isLoggedIn
    }
  }
  expect(getIsLoggedIn(testProps)).toEqual(isLoggedIn)
})
