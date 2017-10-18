import sessionReducer from './sessionReducer'
import { CHECK_VERSION } from '../../components/VersionCheck/actions'

describe('on CHECK_VERSION', () => {
  it('returns the payload', () => {
    const state = {}
    const action = {
      type: CHECK_VERSION,
      payload: {
        type: 'suggest',
        title: 'title',
        message: 'message',
        link: 'link'
      }
    }
    expect(sessionReducer(state, action))
    .toMatchSnapshot()
  })
})
