import sessionReducer, { isJoinCommunityUrl } from './sessionReducer'
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

describe('isJoinCommunityUrl', () => {
  expect(isJoinCommunityUrl('someurl.com/h/use-invitation')).toBe(true)
  expect(isJoinCommunityUrl('someurl.com/c/something/join/accessCode')).toBe(true)
  expect(isJoinCommunityUrl('someurl.com/other/endpoint')).toBe(false)
})
