import { AsyncStorage } from 'react-native'
import { debounce } from 'lodash'
export const PERSISTED_STATE_KEY = 'persisted-app-state-v2'

export function persist (reducer) {
  return (state, action) => {
    const nextState = reducer(state, action)
    if (nextState !== state) save(nextState)
    return nextState
  }
}

const save = debounce(state => {
  const serialized = JSON.stringify(state)
  const startTime = Date.now()
  AsyncStorage.setItem(PERSISTED_STATE_KEY, serialized, () => {
    console.log(`persisted state in ${Date.now() - startTime}ms`)
  })
}, 2000)
