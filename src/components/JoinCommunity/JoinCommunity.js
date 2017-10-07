// dispatchProps.useInvitation(userId, {invitationToken, accessCode})
import React, { Component } from 'react'
import Loading from '../Loading'

export default class JoinCommunity extends Component {
  componentWillMount () {
    this.props.useInvitation().then(result => this.props.goToCommunity())
  }

  // TODO: This is in alternative to using the promise above in cWillMount
  //       Test this more idiomatic option to see if it provides any
  //       advantages or works the same.
  // componentWillReceiveProps (nextProps) {
  //   if (!this.props.communityId && nextProps.communityId) {
  //     this.props.goToCommunity()
  //   }
  // }

  render () {
    return <Loading />
  }
}
