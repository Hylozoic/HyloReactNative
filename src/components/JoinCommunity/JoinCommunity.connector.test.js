import { MODULE_NAME } from './JoinCommunity.store'
import orm from 'store/models'
import {
  mapStateToProps,
  mapDispatchToProps,
  goToCommunityFromRoot,
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
    session.Me.create(currentUserPOJO)
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
      [MODULE_NAME]: {
        membership
      }
    }
    expect(mapStateToProps(testState, testProps)).toEqual({
      currentUser: expect.objectContaining(currentUserPOJO),
      invitationCodes: {
        invitationToken: testProps.navigation.state.params.token,
        accessCode: testProps.navigation.state.params.accessCode
      },
      communityId: community.id
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
  // TODO
  // const { goToCommunity, currentUser, invitationCodes } = stateProps
  // const { useInvitation } = dispatchProps
  // it should goToCommunity if communityId is resolved from useInvitation
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
