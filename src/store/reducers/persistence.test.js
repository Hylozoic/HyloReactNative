import { persist } from './persistence'
import { LOGOUT } from '../../components/Login/actions'
import AsyncStorage from '@react-native-community/async-storage'

jest.mock('react-native-fbsdk')
jest.mock('react-native', () => ({
  AsyncStorage: {
    setItem: jest.fn()
  }
}))

jest.mock('lodash', () => ({
  debounce: (fn, timeout) => fn
}))

it('returns unchanged state when action is LOGOUT', () => {
  const reducer = (state, action) => ({foo: 'bar'})
  const state = {}
  const action = {type: LOGOUT}
  const newState = persist(reducer)(state, action)

  expect(newState).toEqual({foo: 'bar'})
  expect(AsyncStorage.setItem).not.toBeCalled()
})
