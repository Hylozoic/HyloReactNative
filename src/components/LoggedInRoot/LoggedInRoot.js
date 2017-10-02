import React from 'react'
import RootNavigator from '../RootNavigator'
import SocketListener from '../SocketListener'
import { View } from 'react-native'
import { urlPrefix } from 'util/platform'
import { init as initOneSignal } from 'util/onesignal'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
export default class LoggedInRoot extends React.Component {
  componentDidMount () {
    const { fetchCurrentUser, registerDevice } = this.props
    fetchCurrentUser()
    initOneSignal({registerDevice})
  }

  render () {
    return <View style={{flex: 1}}>
      <RootNavigator uriPrefix={urlPrefix} />
      <SocketListener />
    </View>
  }
}
