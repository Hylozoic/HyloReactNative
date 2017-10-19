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
    changeCommunity: jest.fn(x => x)
  }
  const ownProps = {
    navigation: {
      navigate: jest.fn(x => x)
    }
  }
  const result = mergeProps(stateProps, dispatchProps, ownProps)
  result.selectCommunity('anything')
  expect(result.selectCommunity('anything')).toEqual('')
  expect(result.showSettings()).toEqual('')
  expect(result.goToMyProfile()).toEqual('')
  expect(result).toMatchSnapshot()
})


// selectCommunity: community => {
//   dispatchProps.changeCommunity(community.id)
//   navigation.navigate('DrawerClose')
// },
// showSettings: () => {
//   navigation.navigate('UserSettings', {name})
// },
// goToMyProfile: () => {
//   navigation.navigate('MemberProfile', {id: currentUser.id})
// }
//
