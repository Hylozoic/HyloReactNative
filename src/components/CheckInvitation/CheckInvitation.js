import React, { Component } from 'react'
import { get } from 'lodash/fp'
import Loading from '../Loading'

export default class CheckInvitation extends Component {
  componentDidMount () {
    const { navigation, checkInvitation, setInvitationCodes } = this.props
    checkInvitation().then(result => {
      const validToken = get('payload.data.checkInvitation.valid', result)
      if (validToken) {
        // setInvitationCodes()
        navigation.navigate('Signup')
      } else {
        navigation.navigate('InviteExpired')
      }
    })
    // NOTE: If their is a technical error in the
    // process of checking the invitation currently
    // the user will be forwarded on to the Signup page
    // given that we don't know if their is an issue (expired)
    // with the invite or if there was just some other issue.
    // SO in this case the user will still be prompted to
    // continue to signup (or login) and JoinCommunity will
    // be tried again upon signing in.
    .catch(err => navigation.navigate('Signup'))
  }

  render () {
    // TODO: Full screen Loading styles, see ../RootView.js styles
    return <Loading />
  }
}
