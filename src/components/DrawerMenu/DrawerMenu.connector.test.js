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
        navigate: jest.fn(x => x)
      }
    }
    props = mergeProps(stateProps, dispatchProps, ownProps)
  })

  it('matches snapshot', () => {
    expect(props).toMatchSnapshot()
    expect(props.goToCommunitySettings).toBeDefined()

    stateProps.canModerateCurrentCommunity = false
    const propsNonModerator = mergeProps(stateProps, dispatchProps, ownProps)
    expect(propsNonModerator).toMatchSnapshot()
    expect(propsNonModerator.goToCommunitySettings).toBeFalsy()
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

    it('goToCommunitySettings', () => {
      props.goToCommunitySettings()
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
