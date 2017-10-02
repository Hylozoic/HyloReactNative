// dispatchProps.useInvitation(userId, {invitationToken, accessCode})
import React, { Component } from 'react'
import Loading from '../Loading'

export default class JoinCommunity extends Component {
  componentWillMount () {
    const { useInvitation, currentUser } = this.props
    useInvitation(currentUser.id)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id)
    }
  }

  render () {
    const { communitySlug } = this.props
    console.log('!!! In Join Community')
    if (!communitySlug) return <Loading />
    //   navigate to joined community
  }
}
