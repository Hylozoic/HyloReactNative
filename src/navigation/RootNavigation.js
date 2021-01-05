import { CommonActions } from '@react-navigation/native'
import React from 'react'

export const isReadyRef = React.createRef()
export const navigationRef = React.createRef()

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params)
  } else {
    console.log('!!! navigation action ignored', name, params)
  }
}

export function reset(newState) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.dispatch(state => {
      return CommonActions.reset(newState)
    })
  } else {
    console.log('!!! navigation reset ignored', newState)
  }
}
