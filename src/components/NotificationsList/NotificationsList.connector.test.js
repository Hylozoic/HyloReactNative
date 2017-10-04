import { mapStateToProps, mapDispatchToProps } from './NotificationsList.connector'

it('matches the last snapshot for mapDispatchToProps', () => {
  const dispatch = () => {}
  const props = { navigation: { navigate: () => {} } }
  expect(mapDispatchToProps(dispatch, props)).toMatchSnapshot()
})
