import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  partitionCommunities
} from './DrawerMenu.connector'

describe('mapStateToProps matches the latest snapshot', () => {
  const state = {
    session: {
      loggedIn: true,
      entryUrl: 'http://www.hylo.com/a/path'
    },
    pending: {}
  }
  const props = {
    navigation: 'anything'
  }
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

describe('mapDispatchToProps matches the last snapshot', () =>
  expect(mapDispatchToProps).toMatchSnapshot()
)

it('mergeProps matches the last snapshot and bound functions work as expected', () => {
  const stateProps = {
    currentUser: {id: 'anyid'},
    canModerateCurrentCommunity: false,
    name: 'Roy Rogers'
  }
  const dispatchProps = {
    selectCommunity: jest.fn(x => x),
    selectNetwork: jest.fn(x => x)
  }
  const ownProps = {
    navigation: {
      navigate: jest.fn(x => x)
    }
  }
  const propsNonModerator = mergeProps(stateProps, dispatchProps, ownProps)
  expect(propsNonModerator).toMatchSnapshot()
  expect(propsNonModerator.goToCommunitySettings).toBeFalsy()

  stateProps.canModerateCurrentCommunity = true
  const props = mergeProps(stateProps, dispatchProps, ownProps)
  expect(props).toMatchSnapshot()
  expect(props.goToCommunitySettings).toBeDefined()

  const community = {id: 'testcommunity'}
  props.goToCommunity(community)
  expect(dispatchProps.selectCommunity).toHaveBeenCalled()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  const network = {id: 'testnetwork'}
  props.goToNetwork(network)
  expect(dispatchProps.selectNetwork).toHaveBeenCalled()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  props.showSettings()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  props.goToMyProfile()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  props.goToCreateCommunityName()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
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
