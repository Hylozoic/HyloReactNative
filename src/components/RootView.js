import React from 'react'
import { Text, View } from 'react-native'
import SessionCheck from './SessionCheck'
import { Provider } from 'react-redux'
import getStore from '../store'
import mixins from '../style/mixins'
/*
export default class RootView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    getStore().then(store => this.setState({store}))
  }

  render () {
    return this.state.store
      ? <Provider store={this.state.store}><SessionCheck /></Provider>
      : <View style={mixins.allCentered}><Text>Loading...</Text></View>
  }
}
*/

import Editor from './Editor'
export default class RootView extends React.Component {
  render () {
    const containerStyle = {
      flex: 1,
      ...mixins.belowStatusBar
    }

    return <View style={containerStyle}>
      <Editor />
    </View>
  }
}
