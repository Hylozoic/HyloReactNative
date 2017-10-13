import React from 'react'
import { Alert, Linking } from 'react-native'
import { isIOS } from 'util/platform'
import Loading from '../Loading'

export default class VersionCheck extends React.Component {
  componentWillMount = () => {
    this.props.checkVersion()
  }
  showAlert = (updateType) => {
    const storeName = isIOS ? 'App Store' : 'Play Store'
    const APP_STORE_LINK = 'https://itunes.apple.com/app/com.hylo.HyloA'
    const PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.hylo.reactnative'
    const buttons = [
      {
        text: 'Update Now',
        onPress: () => {
          if (isIOS) {
            Linking.openURL(APP_STORE_LINK)
          } else {
            Linking.openURL(PLAY_STORE_LINK)
          }
        }
      }
    ]
    if (updateType.type === 'suggest') {
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
    const { updateType, pending } = this.props
    if (pending) return <Loading />
    updateType && this.showAlert(updateType)
    return this.props.children
  }
}
