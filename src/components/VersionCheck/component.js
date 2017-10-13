import React from 'react'
import { Alert, Linking } from 'react-native'
import { isIOS } from 'util/platform'

export default class VersionCheck extends React.Component {
  showAlert = (updateType) => {
    const storeName = isIOS ? 'App Store' : 'Play Store'
    const APP_STORE_LINK = 'https://itunes.apple.com/app/com.hylo.HyloA'
    const PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.hylo.reactnative'
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
      buttons,
      { cancelable: false }
    )
  }

  render () {
    const { updateType } = this.props
    updateType && this.showAlert(updateType)
    return this.props.children
  }
}
