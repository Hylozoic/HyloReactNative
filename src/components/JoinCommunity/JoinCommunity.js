import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../Loading'

export default class JoinCommunity extends Component {
  static propTypes = {
    useInvitation: PropTypes.func.isRequired
  }

  componentDidMount () {
    return this.props.useInvitation()
  }

  render () {
    return <Loading />
  }
}
