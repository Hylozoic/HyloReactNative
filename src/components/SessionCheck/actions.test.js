import { checkSession } from './actions'

describe('checkSession', () => {
  it('works with a cookie', () => {
    jest.mock('../../util/session', () => ({
      getSessionCookie: () => Promise.resolve('cookie')
    }))
    expect(checkSession()).toMatchSnapshot()
  })

  it('works without a cookie', () => {
    jest.mock('../../util/session', () => ({
      getSessionCookie: () => Promise.resolve(false)
    }))
    expect(checkSession()).toMatchSnapshot()
  })
})
