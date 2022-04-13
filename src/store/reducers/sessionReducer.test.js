import sessionReducer from './sessionReducer'
import { LOGIN, SELECT_GROUP } from 'store/constants'

describe('on LOGIN', () => {
  it('stores login email as default', () => {
    const action = {
      type: LOGIN,
      payload: { id: '7' },
      meta: {
        email: 'foo@bar.com'
      }
    }
    expect(sessionReducer(null, action)).toEqual({
      defaultLoginEmail: 'foo@bar.com'
    })
  })
})

describe('on SELECT_GROUP', () => {
  it('returns the payload', () => {
    const state = {
    }
    const action = {
      type: SELECT_GROUP,
      payload: '123'
    }
    expect(sessionReducer(state, action))
      .toMatchSnapshot()
  })
})
