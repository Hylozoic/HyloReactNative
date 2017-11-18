import React from 'react'
import Loading from '../Loading'
import { View } from 'react-native'
import RootNavigator from '../RootNavigator'
import VersionCheck from '../VersionCheck'
import LoadingModal from '../LoadingModal'
import EntryLinkHandler from '../EntryLinkHandler'
import { Provider } from 'react-redux'
import getStore from '../../store'
import { init as initOneSignal } from 'util/onesignal'
import receivePushNotification from '../../store/actions/receivePushNotification'

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
          <LoadingModal />
          <VersionCheck>
            <RootNavigator />
          </VersionCheck>
          <EntryLinkHandler />
        </View>
      </Provider>
      : <Loading style={{flex: 1}} />
  }
}
