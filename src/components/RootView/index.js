import React from 'react'
import { View, AppState } from 'react-native'
import OneSignal from 'react-native-onesignal'
import { Provider } from 'react-redux'

import DeepLinkHandler from '../DeepLinkHandler'
import { LoadingScreen } from '../Loading'
import LoadingModal from '../LoadingModal'
import RootNavigator from '../RootNavigator'
import SessionCheck from '../SessionCheck'
import VersionCheck from '../VersionCheck'
import receivePushNotification from '../../store/actions/receivePushNotification'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      onesignalNotification: null
    }
  }

  componentWillMount () {
    OneSignal.addEventListener('received', this._handleReceivedPushNotification)
    OneSignal.addEventListener('opened', this._handleOpenedPushNotification)
    OneSignal.inFocusDisplaying(0)
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
    OneSignal.removeEventListener('received', receivePushNotification)
    OneSignal.removeEventListener('opened', this._handleOpenedPushNotification)
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      OneSignal.clearOneSignalNotifications()
    }
    this.setState({appState: nextAppState})
  }

  _handleOpenedPushNotification = ({ notification: { payload } }) =>
    this.setState({ onesignalNotification: payload })

  setNavigator = ref => {
    if (!ref) return
    this.navigator = ref.getWrappedInstance()
    this.forceUpdate() // so that DeepLinkHandler gets the navigator
  }

  render () {
    const { store } = this.props
    const { onesignalNotification } = this.state

    if (store === null) return <LoadingScreen />

    return <Provider store={store}>
      <View style={{flex: 1}}>
        <VersionCheck />
        <SessionCheck>
          <DeepLinkHandler
            navigator={this.navigator}
            onesignalNotification={onesignalNotification} />
        </SessionCheck>
        <LoadingModal />
        <RootNavigator ref={this.setNavigator} />
      </View>
    </Provider>
  }
}
