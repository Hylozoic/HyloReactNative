import { getPending } from './Login.store'
import { LOGIN, LOGIN_WITH_FACEBOOK, LOGIN_WITH_GOOGLE } from './actions'

describe('getPending', () => {
  const defaultPending = {
    [LOGIN]: false,
    [LOGIN_WITH_FACEBOOK]: false,
    [LOGIN_WITH_GOOGLE]: false
  }

  it('returns false when none are pending', () => {
    const pending = {
      ...defaultPending,
      control: true
    }
    expect(getPending({pending})).toEqual(false)
  })

  it('returns true when LOGIN is pending', () => {
    const pending = {
      ...defaultPending,
      [LOGIN]: true
    }
    expect(getPending({pending})).toEqual(true)
  })

  it('returns true when LOGIN_WITH_FACEBOOK is pending', () => {
    const pending = {
      ...defaultPending,
      [LOGIN_WITH_FACEBOOK]: true
    }
    expect(getPending({pending})).toEqual(true)
  })

  it('returns true when LOGIN_WITH_FACEBOOK is pending', () => {
    const pending = {
      ...defaultPending,
      [LOGIN_WITH_FACEBOOK]: true
    }
    expect(getPending({pending})).toEqual(true)
  })

  it('returns true when LOGIN_WITH_GOOGLE is pending', () => {
    const pending = {
      ...defaultPending,
      [LOGIN_WITH_GOOGLE]: true
    }
    expect(getPending({pending})).toEqual(true)
  })
})
