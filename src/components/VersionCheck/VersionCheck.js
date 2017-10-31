import React from 'react'
import { Alert, Linking } from 'react-native'
import Loading from '../Loading'

export default class VersionCheck extends React.PureComponent {
  componentDidMount () {
    this.props.checkVersion()
  }

  showAlert = (updateType) => {
    const type = updateType.type
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
      updateType.title,
      updateType.message,
      buttons,
      { cancelable: false }
    )
  }

  render () {
    const { updateType, pending } = this.props
    if (pending) return <Loading style={{flex: 1}} />
    updateType && this.showAlert(updateType)

    return this.props.children
  }
}
