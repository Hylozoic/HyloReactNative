import React from 'react'
import { View, AppState } from 'react-native'
import { LoadingScreen } from '../Loading'
import VersionCheck from '../VersionCheck'
import LoadingModal from '../LoadingModal'
import { Provider } from 'react-redux'
// import { init as initOneSignal } from 'util/onesignal'
// import receivePushNotification from '../../store/actions/receivePushNotification'
import DeepLinkHandler from '../DeepLinkHandler'
import RootNavigator from '../RootNavigator'
import SessionCheck from '../SessionCheck'
import OneSignal from 'react-native-onesignal'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState
    }
  }

  componentWillMount () {
    OneSignal.addEventListener('received', this._handleReceivedPushNotification)
    OneSignal.addEventListener('opened', this._handleOpenedPushNotification)
    OneSignal.addEventListener('ids', this._handleIds)
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
    OneSignal.removeEventListener('received', this._handleReceivedPushNotification)
    OneSignal.removeEventListener('opened', this._handleOpenedPushNotification)
    OneSignal.removeEventListener('ids', this._handleIds)
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      OneSignal.clearOneSignalNotifications()
    }
    this.setState({appState: nextAppState})
  }

  _handleReceivedPushNotification = notification => {}

  setNavigator = ref => {
    if (!ref) return
    this.navigator = ref.getWrappedInstance()
    this.forceUpdate() // so that DeepLinkHandler gets the navigator
  }

  render () {
    const { store } = this.props

    if (store === null) return <LoadingScreen />

    return <Provider store={store}>
      <View style={{flex: 1}}>
        <VersionCheck />
        <SessionCheck>
          <DeepLinkHandler navigator={this.navigator} />
        </SessionCheck>
        <LoadingModal />
        <RootNavigator ref={this.setNavigator} />
      </View>
    </Provider>
  }
}
