import React from 'react'
import { Alert, Linking } from 'react-native'
import { isIOS } from 'util/platform'
import Loading from '../Loading'

export default class VersionCheck extends React.Component {
  componentWillMount = () => {
    this.props.checkVersion()
  }
  showAlert = (updateType) => {
    const type = updateType.type
    const storeName = isIOS ? 'App Store' : 'Play Store'
    const buttons = [
      {
        text: 'Update Now',
        onPress: () => {
          if (type === 'force') this.showAlert(updateType)
          Linking.openURL(updateType.link)
        }
      }
    ]
    if (type === 'suggest') {
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
    console.log('updateType', this.props.updateType)
    const { updateType, pending } = this.props
    if (pending) return <Loading />
    updateType && this.showAlert(updateType)
    return this.props.children
  }
}
