import handleLogout from './handleLogout'
import { LOGOUT } from '../../components/Login/actions'

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
