import { checkSession, checkVersion } from './actions'

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

describe('checkVersion', () => {
  it('matches the existing snapshot', () => {
    const platform = 'ios'
    const version = '1.0'
    expect(checkVersion()).toMatchSnapshot()
  })
})
