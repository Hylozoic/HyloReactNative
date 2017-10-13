import handleLogout from './handleLogout'
import { LOGOUT } from '../../components/Login/actions'

jest.mock('react-native-device-info')

it('resets the whole app state', () => {
  const state = {
    foo: 'bar',
    baz: 'bonk'
  }

  const action = {
    type: LOGOUT
  }
  expect(handleLogout(state, action))
  .toMatchSnapshot()
})
