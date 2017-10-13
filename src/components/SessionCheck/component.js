import React from 'react'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import Loading from '../Loading'
import VersionCheck from '../VersionCheck'

export default class SessionCheck extends React.Component {
  componentDidMount () {
    this.props.checkSession()
  }

  render () {
    if (this.props.pending) {
      return <Loading />
    }

    switch (this.props.loggedIn) {
      case true:
        return <VersionCheck><LoggedInRoot /></VersionCheck>
      case false:
        return <VersionCheck><LoginNavigator /></VersionCheck>
      default:
        return <Loading />
    }
  }
}
