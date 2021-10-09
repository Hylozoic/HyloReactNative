import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  partitionGroups
} from './DrawerMenu.connector'
import orm from 'store/models'

it('mapStateToProps matches the latest snapshot', () => {
  const session = orm.session(orm.getEmptyState())
  session.Me.create({ id: '33', name: 'meUser' })
  session.Group.create({ id: '7', avatarUrl: 'someUrl', name: 'someName' })

  const state = {
    session: {
      signedIn: true,
      entryUrl: 'http://www.hylo.com/a/path'
    },
    pending: {},
    session: { groupId: '7' },
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
      currentUser: { id: 'anyid' },
      canModerateCurrentGroup: true,
      name: 'Roy Rogers'
    }
    dispatchProps = {
      selectGroup: jest.fn(x => x)
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
    expect(props.goToGroupSettings).toBeDefined()

    stateProps.canModerateCurrentGroup = false
    const propsNonModerator = mergeProps(stateProps, dispatchProps, ownProps)
    expect(propsNonModerator).toMatchSnapshot()
  })

  describe('canModerate functions are bound', () => {
    it('goToGroup', () => {
      const group = { id: 'testgroup' }
      props.goToGroup(group)
      expect(dispatchProps.selectGroup).toHaveBeenCalled()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('should goToMyProfile', () => {
      props.goToMyProfile()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('goToCreateGroup', () => {
      props.goToCreateGroup()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })

    it('goToGroupSettings', () => {
      props.goToGroupSettings()
      expect(ownProps.navigation.navigate).toHaveBeenCalledTimes(1)
    })
  })
})
