import React from 'react'
import RootNavigator from './RootNavigator'
import SocketListener from './SocketListener'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { isIOS } from 'util/platform'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    const prefix = isIOS ? 'HyloReactNative://' : 'HyloReactNative://HyloReactNative/'

    return <View style={{flex: 1}}>
      <RootNavigator uriPrefix={prefix} />
      <SocketListener />
    </View>
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)
