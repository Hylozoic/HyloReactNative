import React from 'react'
import SessionCheck from './SessionCheck'
import { Provider } from 'react-redux'
import getStore from '../store'

export default class RootView extends React.Component {
  render () {
    return <Provider store={getStore()}>
      <SessionCheck />
    </Provider>
  }
}
