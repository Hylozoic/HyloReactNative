import React from 'react'
import { View } from 'react-native'
import { LoadingScreen } from '../Loading'
import VersionCheck from '../VersionCheck'
import LoadingModal from '../LoadingModal'
import { Provider } from 'react-redux'
import getStore from '../../store'
import { init as initOneSignal } from 'util/onesignal'
import receivePushNotification from '../../store/actions/receivePushNotification'
import DeepLinkHandler from '../DeepLinkHandler'
import RootNavigator from '../RootNavigator'
import SessionCheck from '../SessionCheck'
import OneSignal from 'react-native-onesignal'

// if the user opens the app from a push notification and the app wasn't already
// loaded, we need to register the OneSignal event listener early, otherwise we
// miss the event
let initialPushNotificationEvent
OneSignal.addEventListener('opened', event => {
  initialPushNotificationEvent = event
})

export default class RootView extends React.Component {
  state = {}

  componentDidMount () {
    getStore().then(store => {
      this.setState({
        store,
        initialPushNotificationEvent
      })

      initOneSignal({
        receivePushNotification: notification =>
          store.dispatch(receivePushNotification(notification))
      })
    })
  }

  setNavigator = ref => {
    if (!ref) return
    this.navigator = ref.getWrappedInstance()
    this.forceUpdate() // so that DeepLinkHandler gets the navigator
  }

  render () {
    const { store, initialPushNotificationEvent } = this.state
    if (!store) return <LoadingScreen />

    return <Provider store={this.state.store}>
      <View style={{flex: 1}}>
        <VersionCheck />
        <SessionCheck>
          <DeepLinkHandler
            navigator={this.navigator}
            {...{initialPushNotificationEvent}} />
        </SessionCheck>
        <LoadingModal />
        <RootNavigator ref={this.setNavigator} />
      </View>
    </Provider>
  }
}
