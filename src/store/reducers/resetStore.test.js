import resetStore from './resetStore'
import { LOGOUT } from '../../components/Login/actions'

it('resets the whole app state', () => {
  const state = {
    foo: 'bar',
    baz: 'bonk'
  }


  

  const action = {
    type: LOGOUT
  }
  expect(resetStore(state, action))
  .toMatchSnapshot()
})
