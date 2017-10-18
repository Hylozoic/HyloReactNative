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

  componentDidMount = () => {
    const { updateType } = this.props
    updateType && this.showAlert(updateType)
  }

  render () {
    const { pending } = this.props
    if (pending) return <Loading />
    return this.props.children
  }
}
