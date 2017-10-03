// dispatchProps.useInvitation(userId, {invitationToken, accessCode})
import React, { Component } from 'react'
import Loading from '../Loading'

export default class JoinCommunity extends Component {
  componentWillMount () {
    const { useInvitation, currentUser, invitationCodes } = this.props
    console.log('this.props:', this.props)
    useInvitation(1, invitationCodes)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id, nextProps.invitationCodes)
    }
  }

  render () {
    const { communitySlug } = this.props
    console.log('!!! In Join Community')
    if (!communitySlug) return <Loading />
    //   navigate to joined community
  }
}
