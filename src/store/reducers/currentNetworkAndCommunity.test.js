import currentNetworkAndCommunity from './currentNetworkAndCommunity'
import { FETCH_CURRENT_USER, SELECT_COMMUNITY } from '../actions/fetchCurrentUser'

describe('on SELECT_COMMUNITY', () => {
  it('returns the payload', () => {
    const state = {
      id: 1,
      name: 'moon'
    }
    const action = {
      type: SELECT_COMMUNITY,
      payload: {
        id: 123,
        name: 'foom'
      }
    }
    expect(currentNetworkAndCommunity(state, action))
      .toMatchSnapshot()
  })
})

describe('on FETCH_CURRENT_USER', () => {
  it('handles a user with a membership', () => {
    const state = {
      id: 1
    }
    const action = {
      type: FETCH_CURRENT_USER,
      payload: {
        data: {
          me: {
            memberships: [
              {
                community: {
                  id: 34
                }
              }
            ]
          }
        }
      }
    }
    expect(currentNetworkAndCommunity(state, action))
      .toMatchSnapshot()
  })

  it('handles a user with no memberships', () => {
    const state = {
      id: 1
    }
    const action = {
      type: FETCH_CURRENT_USER,
      payload: {
        data: {
          me: {
            memberships: []
          }
        }
      }
    }
    expect(currentNetworkAndCommunity(state, action))
      .toMatchSnapshot()
  })
})
