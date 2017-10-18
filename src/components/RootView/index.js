import React from 'react'
import { Text, View } from 'react-native'
import SessionCheck from '../SessionCheck'
import VersionCheck from '../VersionCheck'
import { Provider } from 'react-redux'
import getStore from '../../store'
import mixins from '../../style/mixins'

export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    getStore().then(store => this.setState({store}))
  }

  render () {
    return this.state.store
      ? <Provider store={this.state.store}><VersionCheck><SessionCheck /></VersionCheck></Provider>
      : <View style={mixins.allCentered}><Text>Loading...</Text></View>
  }
}
