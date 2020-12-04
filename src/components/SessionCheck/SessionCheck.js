import React from 'react'

export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const signedIn = await this.props.checkSession()
    this.props.navigation.navigate(signedIn ? 'AppNavigator' : 'AuthNavigator')
  }

  render() {
    return null
  }
}
