import React from 'react'
import { Text, View } from 'react-native'
import SessionCheck from '../SessionCheck'
import VersionCheck from '../VersionCheck'
import LoadingModal from '../LoadingModal'
import { Provider } from 'react-redux'
import getStore from '../../store'
import mixins from '../../style/mixins'

export default class RootView extends React.Component {
  state = {}

  componentDidMount () {
    getStore().then(store => this.setState({store}))
  }

  render () {
    return this.state.store
      ? <Provider store={this.state.store}>
        <View style={{flex: 1}}>
          <LoadingModal />
          <VersionCheck>
            <SessionCheck />
          </VersionCheck>
        </View>
      </Provider>
      : <View style={mixins.allCentered}><Text>Loading...</Text></View>
  }
}
