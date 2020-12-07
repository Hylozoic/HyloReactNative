import React from 'react'
import { View, AppState } from 'react-native'
import OneSignal from 'react-native-onesignal'
import DeepLinkHandler from '../DeepLinkHandler'
import LoadingModal from '../LoadingModal'
import RootNavigator from '../RootNavigator'
import SessionCheck from '../SessionCheck'
import VersionCheck from '../VersionCheck'
import receivePushNotification from '../../store/actions/receivePushNotification'
import Loading from '../Loading'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      onesignalNotification: null
    }
  }

  UNSAFE_componentWillMount () {
    OneSignal.addEventListener('opened', this._handleOpenedPushNotification)
    OneSignal.addEventListener('received', receivePushNotification)
    OneSignal.inFocusDisplaying(0)
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
    OneSignal.removeEventListener('opened', this._handleOpenedPushNotification)
    OneSignal.removeEventListener('received', receivePushNotification)
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      OneSignal.clearOneSignalNotifications()
    }
    this.setState({appState: nextAppState})
  }

  _handleOpenedPushNotification = ({ notification: { payload } }) =>
    this.setState({ onesignalNotification: payload })

  render () {
    // TODO: Deeplink handling...
    // const { onesignalNotification } = this.state

    return <View style={{flex: 1}}>
      {/* <VersionCheck />
      <LoadingModal /> */}
      <RootNavigator />
    </View>
  }
}
