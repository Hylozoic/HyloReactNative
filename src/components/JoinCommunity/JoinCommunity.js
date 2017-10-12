// dispatchProps.useInvitation(userId, {invitationToken, accessCode})
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../Loading'

export default class JoinCommunity extends Component {
  static propTypes = {
    useInvitation: PropTypes.func.isRequired,
    goToCommunity: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired
  }

  componentWillMount () {
    return this.props.useInvitation()
    .then(this.props.goToCommunity)
  }

  render () {
    return <Loading />
  }
}
