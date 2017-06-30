import React from 'react'
// import RootNavigatorFolder from './RootNavigatorFolder'
import RootNavigator from './RootNavigator'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    return <RootNavigator />
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)
