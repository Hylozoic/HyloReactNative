import React from 'react'
import RootNavigator from '../RootNavigator'
import SocketListener from '../SocketListener'
import { View } from 'react-native'
import { urlPrefix } from 'util/platform'
import { init as initOneSignal } from 'util/onesignal'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
export default class LoggedInRoot extends React.Component {
  componentDidMount () {
    const { fetchCurrentUser, registerDevice } = this.props
    fetchCurrentUser()
    // TODO: navigate to URL here
    //  ... this.navigator()
    console.log('entryURL from LoggedInRoot: ', this.props.entryURL)
    initOneSignal({registerDevice})
  }

  componentWillUpdate (nextProps) {
    console.log('entryURL from LoggedInRoot: ', this.props.entryURL)
    // if (this.props.entryURL && !nextProps.entryURL) {
    //   console.log('entryURL from SessionCheck: ', this.props.entryURL)
    //   this.props.resetEntryURL()
    //   // this.props.entryURL && Linking.openURL(this.props.entryURL)
    // }
  }

  render () {
    return <View style={{flex: 1}}>
      <RootNavigator uriPrefix={urlPrefix} ref={nav => { this.navigator = nav }} />
      <SocketListener />
    </View>
  }
}
