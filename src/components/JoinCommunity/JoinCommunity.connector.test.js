import orm from 'store/models'
import {
  mapStateToProps,
  mapDispatchToProps,
  goToCommunity,
  makeJoinCommunity,
  makeCheckInvitation,
  mergeProps
} from './JoinCommunity.connector'

let session, defaultState

beforeEach(() => {
  session = orm.mutableSession(orm.getEmptyState())
  defaultState = {orm: session.state}
})

test('goToCommunity', () => {
  const communityId = 'anycommunityid'
  const navigation = {
    dispatch: testOutput => testOutput
  }
  const result = goToCommunity(communityId, navigation)
  expect(result).toMatchSnapshot()
})

describe('mapStateToProps', () => {
  it('gets props from navigation object', () => {
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
    expect(mapStateToProps(defaultState, testProps).invitationCodes).toEqual({
      invitationToken: testProps.navigation.state.params.token,
      accessCode: testProps.navigation.state.params.accessCode
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

describe('makeJoinCommunity', () => {
  const currentCommunityId = 'defaultcommunityid'
  const stateProps = {
    currentUser: {id: 'currentuser'},
    currentCommunityId,
    invitationCodes: {
      invitationToken: 'invitationtoken',
      accessCode: 'accesscode'
    },
    goToHome: jest.fn()
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
    return makeJoinCommunity(stateProps, dispatchProps)()
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
      dispatch: jest.fn()
    }
    return makeJoinCommunity(stateProps, dispatchProps)()
    .then(result => {
      expect(stateProps.goToHome).toHaveBeenCalled()
      return expect(dispatchProps.useInvitation).toHaveBeenCalled(result)
    })
  })
})

test('mergeProps', () => {
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

describe('makeCheckInvitation', () => {
  const checkInvitationResponse = (valid) => ({
    payload: {
      data: {
        checkInvitation: {
          valid
        }
      }
    }
  })

  it('should forward to signup page if invite is valid', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () =>
        Promise.resolve(checkInvitationResponse(true))
    }
    return makeCheckInvitation(stateProps, dispatchProps)()
    .then(() => {
      expect(stateProps.navToInviteExpired).not.toHaveBeenCalled()
      return expect(stateProps.navToSignup).toHaveBeenCalled()
    })
  })

  it('should forward to invite expired page if invite is invalid', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () =>
        Promise.resolve(checkInvitationResponse(false))
    }
    return makeCheckInvitation(stateProps, dispatchProps)()
    .then(() => {
      expect(stateProps.navToSignup).not.toHaveBeenCalled()
      return expect(stateProps.navToInviteExpired).toHaveBeenCalled()
    })
  })

  it('should forward to signup page if an error occurs in checking the invite', () => {
    const stateProps = {
      invitationCodes: {},
      navToSignup: jest.fn(),
      navToInviteExpired: jest.fn()
    }
    const dispatchProps = {
      checkInvitation: () => Promise.reject(new Error('anything'))
    }
    return makeCheckInvitation(stateProps, dispatchProps)()
    .then(() => {
      expect(stateProps.navToInviteExpired).not.toHaveBeenCalled()
      return expect(stateProps.navToSignup).toHaveBeenCalled()
    })
  })
})
