import reducer from './TabBar.store'
import { SELECT_COMMUNITY, SELECT_NETWORK } from 'store/constants'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'

it('sets isVisible to false if changing to All Communities', () => {
  const action = {
    type: SELECT_COMMUNITY,
    payload: ALL_COMMUNITIES_ID
  }
  expect(reducer({}, action)).toEqual({isVisible: false})
})

it('sets isVisible to true if changing to a community', () => {
  const action = {
    type: SELECT_COMMUNITY,
    payload: '1'
  }
  expect(reducer({}, action)).toEqual({isVisible: true})
})

it('sets isVisible to true if changing to a network', () => {
  const action = {
    type: SELECT_NETWORK,
    payload: '1'
  }
  expect(reducer({}, action)).toEqual({isVisible: true})
})
