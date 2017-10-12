import React from 'react'
import { Text, View, Alert, Linking } from 'react-native'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import Loading from '../Loading'
import mixins from '../../style/mixins'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'

export default class SessionCheck extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      allowShowAlert: false
    }
  }

  componentDidMount () {
    this.props.checkSession()
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

  componentWillReceiveProps = (nextProps) => {
    const updateType = get('type', nextProps.showUpdateModal)
    if (updateType) {
      this.setState({
        allowShowAlert: !this.state.allowShowAlert
      })
    }
  }

  render () {
    const updateType = get('type', this.props.showUpdateModal)
    const allowShowAlert = get('allowShowAlert', this.state)
    if (this.props.pending) {
      return <Loading />
    }

    updateType && allowShowAlert && this.showAlert(updateType)

    switch (this.props.loggedIn) {
      case true:
        return <LoggedInRoot />
      case false:
        return <LoginNavigator />
      default:
        return <Loading />
    }
  }
}
