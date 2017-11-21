import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LoadingScreen } from '../Loading'

export default class CheckInvitation extends Component {
  static navigationOptions = {
    header: null
  }

  static propTypes = {
    checkInvitation: PropTypes.func.isRequired
  }

  componentDidMount () {
    return this.props.checkInvitation()
  }

  render () {
    return <LoadingScreen />
  }
}
