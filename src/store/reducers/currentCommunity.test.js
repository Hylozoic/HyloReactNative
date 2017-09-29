import currentCommunity from './currentCommunity'
import { FETCH_CURRENT_USER, CHANGE_COMMUNITY } from '../actions/fetchCurrentUser'

describe('on CHANGE_COMMUNITY', () => {
  it('returns the payload', () => {
    const state = {
      id: 1,
      name: 'moon'
    }
    const action = {
      type: CHANGE_COMMUNITY,
      payload: {
        id: 123,
        name: 'foom'
      }
    }
    expect(currentCommunity(state, action))
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
    expect(currentCommunity(state, action))
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
    expect(currentCommunity(state, action))
    .toMatchSnapshot()
  })
})
