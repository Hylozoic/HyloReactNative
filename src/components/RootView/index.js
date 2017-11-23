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

export default class RootView extends React.Component {
  state = {}

  componentDidMount () {
    getStore().then(store => {
      this.setState({store})

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
    if (!this.state.store) return <LoadingScreen />

    return <Provider store={this.state.store}>
      <View style={{flex: 1}}>
        <VersionCheck />
        <LoadingModal />
        <RootNavigator ref={this.setNavigator} />
        <DeepLinkHandler navigator={this.navigator} />
      </View>
    </Provider>
  }
}
