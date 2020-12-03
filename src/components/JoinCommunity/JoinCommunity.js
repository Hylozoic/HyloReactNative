import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LoadingScreen } from '../Loading'

export default class JoinCommunity extends Component {
  static navigationOptions = {
    headerShown: false
  }

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
