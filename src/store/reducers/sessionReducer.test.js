import sessionReducer from './sessionReducer'
import { CHECK_VERSION } from '../../components/VersionCheck/actions'
import { CHECK_INVITATION } from '../../components/CheckInvitation/CheckInvitation.store'
import { RESET_ENTRY_URL } from '../../components/SessionCheck/SessionCheck.store'

describe('on CHECK_VERSION', () => {
  it('returns the payload', () => {
    const state = {}
    const payload = {
      type: 'suggest',
      title: 'title',
      message: 'message',
      link: 'link'
    }
    const action = {
      type: CHECK_VERSION,
      payload
    }
    expect(sessionReducer(state, action)).toEqual({checkVersion: payload})
  })
})

describe('on CHECK_INVITATION', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: CHECK_INVITATION
    }
    expect(sessionReducer(state, action)).toEqual({hasSignupLink: true})
  })
})

describe('on RESET_ENTRY_URL', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: RESET_ENTRY_URL
    }
    expect(sessionReducer(state, action)).toEqual({entryURL: null, hasSignupLink: false})
  })
})

describe('on CHECK_INVITATION', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: CHECK_INVITATION
    }
    expect(sessionReducer(state, action)).toEqual({hasSignupLink: true})
  })
})
