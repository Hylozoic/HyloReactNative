import currentCommunity from './currentCommunity'
import { FETCH_CURRENT_USER } from '../actions/fetchCurrentUser'

describe('on FETCH_CURRENT_USER', () => {
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
