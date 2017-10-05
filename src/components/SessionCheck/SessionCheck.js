import React from 'react'
import PropTypes from 'prop-types'
import { urlPrefix } from 'util/platform'
import URL from 'url-parse'
import { Text, View, Linking } from 'react-native'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import mixins from '../../style/mixins'

export default class SessionCheck extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    actions: PropTypes.shape({
      checkSession: PropTypes.func.isRequired,
      setEntryURL: PropTypes.func.isRequired
    }).isRequired
  }

  _captureEntryURL = (url) => {
    const { pathname } = URL(url, true)
    this.props.actions.setEntryURL(pathname)
  }

  componentDidMount (nextProps) {
    // this handles the case where the app is closed and is launched via Universal Linking.
    Linking.getInitialURL().then(url => this._captureEntryURL(url))
    // This listener handles the case where the app is woken up from the Universal Linking
    Linking.addEventListener('url', ({ url }) => this._captureEntryURL(url))
    this.props.actions.checkSession()
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this._handleOpenURL)
  }

  render () {
    switch (this.props.loggedIn) {
      case true:
        return <LoggedInRoot />
      case false:
        return <LoginNavigator uriPrefix={urlPrefix} />
      default:
        return <View style={mixins.allCentered}>
          <Text>Loading...</Text>
        </View>
    }
  }
}
