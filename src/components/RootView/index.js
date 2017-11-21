import React from 'react'
import { View } from 'react-native'
import { LoadingScreen } from '../Loading'
import VersionCheck from '../VersionCheck'
import LoadingModal from '../LoadingModal'
import { Provider } from 'react-redux'
import getStore from '../../store'
import { init as initOneSignal } from 'util/onesignal'
import receivePushNotification from '../../store/actions/receivePushNotification'
import NavigationContext from '../redirectsAfterLogin/NavigationContext'

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

  render () {
    return this.state.store
      ? <Provider store={this.state.store}>
        <View style={{flex: 1}}>
          <VersionCheck />
          <LoadingModal />
          <NavigationContext />
        </View>
      </Provider>
      : <LoadingScreen />
  }
}
