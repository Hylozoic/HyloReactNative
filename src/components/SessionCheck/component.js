import React from 'react'
import { Text, View, Alert, Linking } from 'react-native'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import mixins from '../../style/mixins'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'

export default class SessionCheck extends React.Component {
  componentDidMount () {
    this.props.checkSession()
    this.props.checkVersion()
  }

  showAlert = (updateType) => {
    const storeName = isIOS ? 'App Store' : 'Play Store'
    const APP_STORE_LINK = 'itms://itunes.apple.com/us/app/apple-store/myiosappid?mt=8'
    const PLAY_STORE_LINK = 'http://play.google.com/store/'
    const buttons = [
      {
        text: 'Update Now',
        onPress: () => {
          if (isIOS) {
            Linking.openURL(APP_STORE_LINK).catch(err => console.error('An error occurred', err))
          } else {
            Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('An error occurred', err))
          }
        }
      }
    ]
    if (updateType === 'suggest') {
      buttons.push({
        text: 'Cancel'
      })
    }
    return Alert.alert(
      "There's a new version of Hylo",
      `Update Hylo on the ${storeName} and discover what is new.`,
      buttons
    )
  }

  render () {
    const updateType = get('type', this.props.showUpdateModal)
    if (this.props.pending) {
      return <View style={mixins.allCentered}>
        <Text>Loading...</Text>
      </View>
    }

    updateType && this.showAlert(updateType)

    switch (this.props.loggedIn) {
      case true:
        return <LoggedInRoot />
      case false:
        return <LoginNavigator />
      default:
        return <View style={mixins.allCentered}>
          <Text>Loading...</Text>
        </View>
    }
  }
}
