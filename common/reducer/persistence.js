import { AsyncStorage } from 'react-native'
export const PERSISTED_STATE_KEY = 'persisted-app-state-v1'

export function persist (reducer) {
  return function (state, action) {
    const nextState = reducer(state, action)
    if (nextState !== state) {
      const serialized = JSON.stringify(nextState)
      const startTime = Date.now()
      AsyncStorage.setItem(PERSISTED_STATE_KEY, serialized, () => {
        console.log(`persisted state in ${Date.now() - startTime}ms`)
      })
    }
    return nextState
  }
}
