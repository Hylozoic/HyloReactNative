import sessionReducer from './sessionReducer'
import { CHECK_INVITATION } from '../../components/JoinCommunity/JoinCommunity.store'

describe('on CHECK_INVITATION', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: CHECK_INVITATION
    }
    expect(sessionReducer(state, action)).toEqual({hasSignupLink: true})
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
