import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import mixins from '../../style/mixins'
import fetchVersion from 'util/fetchVersion'

export default class SessionCheck extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    actions: PropTypes.shape({
      checkSession: PropTypes.func.isRequired
    }).isRequired
  }

  componentDidMount () {
    this.props.actions.checkSession()
    fetchVersion()
  }

  render () {
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
