import sessionReducer from './sessionReducer'
import { CHECK_VERSION } from '../../components/VersionCheck/actions'

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
