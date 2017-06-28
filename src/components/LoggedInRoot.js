import React from 'react'
import NavigatorWithBar from './NavigatorWithBar'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import { connect } from 'react-redux'

// this component just sets up a navigator so that views can open full-screen,
// above the tab bar
class LoggedInRoot extends React.Component {
  static navigationOptions = {
    title: 'Menu'
  };

  componentDidMount () {
    this.props.fetchCurrentUser()
  }

  render () {
    return <NavigatorWithBar />
  }
}

export default connect(null, {fetchCurrentUser})(LoggedInRoot)

const styles = {
  navigator: {
    // this is the color behind the receding view during FloatFromBottom
    backgroundColor: 'black'
  }
}
