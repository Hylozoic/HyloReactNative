import {
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
} from './DrawerMenu.connector'

test('mapStateToProps matches the latest snapshot', () => {
  const state = {
    session: {
      loggedIn: true,
      entryURL: 'http://www.hylo.com/a/path'
    },
    pending: {}
  }
  const props = {
    navigation: 'anything'
  }
  expect(mapStateToProps(state, props)).toMatchSnapshot()
})

test('mapDispatchToProps matches the last snapshot', () =>
  expect(mapDispatchToProps).toMatchSnapshot()
)

test('mergeProps matches the last snapshot and bound functions work as expected', () => {
  const stateProps = {
    currentUser: {id: 'anyid'},
    name: 'Roy Rogers'
  }
  const dispatchProps = {
    changeCommunity: jest.fn(x => x)
  }
  const ownProps = {
    navigation: {
      navigate: jest.fn(x => x)
    }
  }
  const props = mergeProps(stateProps, dispatchProps, ownProps)
  expect(props).toMatchSnapshot()
  const community = {id: 'testcommunity'}
  props.selectCommunity(community)
  expect(dispatchProps.changeCommunity).toHaveBeenCalled()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  props.showSettings()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
  props.goToMyProfile()
  expect(ownProps.navigation.navigate).toHaveBeenCalled()
})
