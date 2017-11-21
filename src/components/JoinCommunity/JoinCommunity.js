import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LoadingScreen } from '../Loading'

export default class JoinCommunity extends Component {
  static navigationOptions = {
    header: null
  }

  static propTypes = {
    useInvitation: PropTypes.func.isRequired
  }

  componentDidMount () {
    return this.props.useInvitation()
  }

  render () {
    return <LoadingScreen />
  }
}
