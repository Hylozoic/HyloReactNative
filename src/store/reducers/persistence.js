import AsyncStorage from '@react-native-community/async-storage'
import { debounce } from 'lodash'
import { isDev } from '../../config'
import { LOGOUT } from '../../components/Login/actions'

export const PERSISTED_STATE_KEY = 'persisted-app-state-v2'

export function persist (reducer) {
  return (state, action) => {
    const nextState = reducer(state, action)
    if (nextState !== state && action.type !== LOGOUT) save(nextState)
    return nextState
  }
}

const save = debounce(state => {
  const serialized = JSON.stringify(state)
  const startTime = Date.now()
  AsyncStorage.setItem(PERSISTED_STATE_KEY, serialized, () => {
    if (isDev) console.log(`persisted state in ${Date.now() - startTime}ms`)
  })
}, 2000)

export function reset () {
  return AsyncStorage.removeItem(PERSISTED_STATE_KEY)
}
