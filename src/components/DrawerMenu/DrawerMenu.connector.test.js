import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  partitionCommunities
} from './DrawerMenu.connector'
import orm from '../../store/models'

it('mapStateToProps matches the latest snapshot', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({id: '33', name: 'meUser'})
  session.Community.create({id: '7', avatarUrl: 'someUrl', name: 'someName'})

  const state = {
    session: {
      signedIn: true,
      entryUrl: 'http://www.hylo.com/a/path'
    },
    pending: {},
    currentNetworkAndCommunity: {communityId: '7'},
    orm: session.state
  }
  const props = {
    navigation: 'anything'
  }
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

it('mapDispatchToProps matches the last snapshot', () =>
  expect(mapDispatchToProps).toMatchSnapshot()
)

describe('mergeProps', () => {
  let stateProps, dispatchProps, ownProps, props
  beforeEach(() => {
    stateProps = {
      currentUser: {id: 'anyid'},
      canModerateCurrentCommunity: true,
      name: 'Roy Rogers'
    }
    dispatchProps = {
      selectCommunity: jest.fn(x => x),
      selectNetwork: jest.fn(x => x)
    }
    ownProps = {
      navigation: {
        navigate: jest.fn(x => x),
        closeDrawer: jest.fn()
      }
    }
    props = mergeProps(stateProps, dispatchProps, ownProps)
  })

  it('matches snapshot', () => {
    expect(props).toMatchSnapshot()
    expect(props.goToCommunitySettingsMenu).toBeDefined()

    stateProps.canModerateCurrentCommunity = false
    const propsNonModerator = mergeProps(stateProps, dispatchProps, ownProps)
    expect(propsNonModerator).toMatchSnapshot()
    expect(propsNonModerator.goToCommunitySettingsMenu).toBeFalsy()
  })

  describe('canModerate functions are bound', () => {
    it('goToCommunity', () => {
      const community = {id: 'testcommunity'}
      props.goToCommunity(community)
      expect(dispatchProps.selectCommunity).toHaveBeenCalled()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(2)
    })

    it('goToNetwork', () => {
      const network = {id: 'testnetwork'}
      props.goToNetwork(network)
      expect(dispatchProps.selectNetwork).toHaveBeenCalledTimes(1)
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(2)
    })

    it('should showSetting', () => {
      props.showSettings()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('should goToMyProfile', () => {
      props.goToMyProfile()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('goToCreateCommunityName', () => {
      props.goToCreateCommunityName()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('goToCommunitySettingsMenu', () => {
      props.goToCommunitySettingsMenu()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })
  })
})

describe('partitionCommunities', () => {
  it('separates independent communities from networked communities', () => {
    const memberships = [
      {
        community: {
          ref: {
            id: '1',
            name: 'one'
          },
          network: {
            ref: {
              id: '1',
              name: 'networkOne'
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '2',
            name: 'two'
          }
        }
      },
      {
        community: {
          ref: {
            id: '3',
            name: 'three'
          },
          network: {
            ref: {
              id: '2',
              name: 'networkTwo',
              communities: {
                toRefArray: () => [
                  {id: '1', name: 'one'},
                  {id: '2', name: 'two'},
                  {id: '3', name: 'three'}
                ]
              }
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '4',
            name: 'four'
          },
          network: {
            ref: {
              id: '1',
              name: 'networkOne'
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '5',
            name: 'five'
          }
        }
      }
    ]
    expect(partitionCommunities(memberships)).toMatchSnapshot()
  })
})
