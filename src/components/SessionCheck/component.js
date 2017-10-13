import React from 'react'
import LoggedInRoot from '../LoggedInRoot'
import LoginNavigator from '../LoginNavigator'
import Loading from '../Loading'
import { get } from 'lodash/fp'
import VersionCheck from '../VersionCheck'

export default class SessionCheck extends React.Component {
  componentDidMount () {
    this.props.checkSession()
    this.props.checkVersion()
  }

  render () {
    const updateType = get('type', this.props.showUpdateModal)
    if (this.props.pending) {
      return <Loading />
    }

    switch (this.props.loggedIn) {
      case true:
        return <VersionCheck updateType={updateType}><LoggedInRoot /></VersionCheck>
      case false:
        return <VersionCheck updateType={updateType}><LoginNavigator /></VersionCheck>
      default:
        return <Loading />
    }
  }
}
