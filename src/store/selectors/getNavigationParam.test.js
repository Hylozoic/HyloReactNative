import getNavigationParam from './getNavigationParam'

describe('getNavigationParam', () => {
  it('returns the expected result', () => {
    const myParam = 'testaccesscode'
    const testProps = {
      navigation: {
        state: {
          params: {
            myParam
          }
        }
      }
    }
    expect(getNavigationParam('myParam', null, testProps)).toEqual(myParam)
  })
})
