import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingScreen from 'navigation/LoadingScreen'

export default class JoinCommunity extends Component {
  static propTypes = {
    checkOrUseInvitation: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.checkOrUseInvitation()
  }

  render () {
    return <LoadingScreen />
  }
}
