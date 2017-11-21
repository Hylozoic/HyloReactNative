import React from 'react'
import { Alert, Linking } from 'react-native'

export default class VersionCheck extends React.PureComponent {
  state = {}

  componentDidMount () {
    this.props.checkVersion().then(() => this.setState({checked: true}))
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
    const { updateType } = this.props
    if (updateType) this.showAlert(updateType)
    return null
  }
}
