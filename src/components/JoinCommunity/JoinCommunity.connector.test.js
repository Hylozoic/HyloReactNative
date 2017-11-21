import { MODULE_NAME } from './JoinCommunity.store'
import orm from 'store/models'
import {
  mapStateToProps,
  mapDispatchToProps,
  goToCommunityFromRoot,
  handleJoinCommunity,
  mergeProps
} from './JoinCommunity.connector'

let session, defaultState

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  defaultState = {orm: session.state}
})

test('goToCommunityFromRoot', () => {
  const communityId = 'anycommunityid'
  const navigation = {
    dispatch: testOutput => testOutput
  }
  const result = goToCommunityFromRoot(communityId, navigation)
  expect(result).toMatchSnapshot()
})

describe('mapStateToProps', () => {
  it('gets props from navigation object', () => {
    const currentUserPOJO = {name: 'me'}
    const currentUser = session.Me.create(currentUserPOJO)
    const testProps = {
      navigation: {
        state: {
          params: {
            token: 'anytoken',
            invitationToken: 'anyinvitationtoken',
            accessCode: 'anyaccesscode'
          }
        }
      }
    }
    const community = {id: 'anycommunityid'}
    const membership = {community}
    const testState = {
      ...defaultState,
      currentCommunity: 'currentcommunityid',
      [MODULE_NAME]: {
        membership
      }
    }
    expect(mapStateToProps(testState, testProps)).toEqual({
      currentUser,
      invitationCodes: {
        invitationToken: testProps.navigation.state.params.token,
        accessCode: testProps.navigation.state.params.accessCode
      }
    })
  })
})

test('mapDispatchToProps', () => {
  const navigation = {
    dispatch: testOutput => testOutput
  }
  const result = mapDispatchToProps(jest.fn(), navigation)
  expect(result).toMatchSnapshot()
})

describe('handleJoinCommunity', () => {
  const currentCommunityId = 'defaultcommunityid'
  const stateProps = {
    currentUser: {id: 'currentuser'},
    currentCommunityId,
    invitationCodes: {
      invitationToken: 'invitationtoken',
      accessCode: 'accesscode'
    }
  }

  it('should forward to the joined community when one is returned', () => {
    const joinedCommunityId = 'joinedcommunity'
    const result = {
      payload: {
        data: {
          useInvitation: {
            membership: {
              community: {
                id: joinedCommunityId
              }
            }
          }
        }
      }
    }
    const dispatchProps = {
      useInvitation: jest.fn(() => Promise.resolve(result)),
      goToCommunity: jest.fn(),
      dispatch: jest.fn()
    }
    return handleJoinCommunity(stateProps, dispatchProps)
    .then(result => {
      expect(dispatchProps.goToCommunity).toHaveBeenCalledWith(joinedCommunityId)
      return expect(dispatchProps.useInvitation).toHaveBeenCalled(result)
    })
  })

  it('should forward to the current community when a joined community is not returned', () => {
    const result = {}
    const dispatchProps = {
      useInvitation: jest.fn(() => Promise.resolve(result)),
      goToCommunity: jest.fn(),
      goToHome: jest.fn(),
      dispatch: jest.fn()
    }
    return handleJoinCommunity(stateProps, dispatchProps)
    .then(result => {
      expect(dispatchProps.goToHome).toHaveBeenCalled()
      return expect(dispatchProps.useInvitation).toHaveBeenCalled(result)
    })
  })
})

it('mergeProps', () => {
  const currentUserPOJO = {name: 'me'}
  const stateProps = {
    communityId: 'anything',
    currentUser: currentUserPOJO,
    currentCommunityId: 'default',
    invitationCodes: {}
  }
  const dispatchProps = {
    useInvitation: jest.fn()
  }
  const ownProps = {
    navigation: {
      state: {
        params: {
          token: 'anytoken',
          invitationToken: 'anyinvitationtoken',
          accessCode: 'anyaccesscode'
        }
      }
    }
  }
  const result = mergeProps(stateProps, dispatchProps, ownProps)
  expect(result).toMatchSnapshot()
})
