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

test('mergeProps matches the last snapshot', () => {
  // const { navigation, currentUser, name } = stateProps
  // dispatchProps.changeCommunity
  const stateProps = {
    currentUser: {id: 'anyid'},
    name: 'Roy Rogers'
  }
  const dispatchProps = {
    changeCommunity: () => {}
  }
  const ownProps = {
    navigation: {
      navigate: () => {}
    }
  }
  const result = mergeProps(stateProps, dispatchProps, ownProps)
  expect(result).toMatchSnapshot()
})
