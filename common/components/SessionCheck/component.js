import React, { PropTypes } from 'react'
import { Text, View } from 'react-native'
import LoggedInRoot from '../LoggedInRoot'
import Login from '../Login'

export default class SessionCheck extends React.Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    actions: PropTypes.shape({
      checkSession: PropTypes.func.isRequired
    }).isRequired
  }

  componentDidMount () {
    this.props.actions.checkSession()
  }

  render () {
    switch (this.props.loggedIn) {
      case true:
        return <LoggedInRoot />
      case false:
        return <Login />
      default:
        return <View style={styles.view}>
          <Text>Loading...</Text>
        </View>
    }
  }
}

const styles = {
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}
