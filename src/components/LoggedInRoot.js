import React from 'react'
import RootNavigator from './RootNavigator'
import SocketListener from './SocketListener'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'
import { Platform, View } from 'react-native'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    return <View style={{flex: 1}}>
      <RootNavigator />
      {Platform.isIOS === true ? <SocketListener /> : null}
    </View>
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)
