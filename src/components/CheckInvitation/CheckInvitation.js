import React, { Component } from 'react'
import { get } from 'lodash/fp'
import Loading from '../Loading'

export default class CheckInvitation extends Component {
  componentDidMount () {
    const { navigation, checkInvitation, setInvitationCodes } = this.props
    checkInvitation().then(result => {
      const validToken = get('payload.data.checkInvitation.valid', result)
      console.log('!!! validToken: ', validToken)
      if (validToken) {
        // setInvitationCodes()
        navigation.navigate('Login')
      } else {
        navigation.navigate('InviteExpired')
      }
    })
    .catch(err => navigation.navigate('Login'))
  }

  render () {
    console.log('!! in checkInvitation props: ', this.props)
    // TODO: Full screen Loading page
    return <Loading />
  }
}
