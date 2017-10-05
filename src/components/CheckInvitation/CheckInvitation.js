import React, { Component } from 'react'
import { get } from 'lodash/fp'
import Loading from '../Loading'

export default class CheckInvitation extends Component {
  componentDidMount () {
    const { navigation, checkInvitation, setInvitationCodes } = this.props
    checkInvitation().then(result => {
      const validToken = get('payload.data.checkInvitation.valid', result)
      // console.log('result.payload.data.checkInvitation: ', result.payload.data.checkInvitation)
      // console.log("get('payload.data.checkInvitation', result): ", get('payload.data.checkInvitation', result))
      console.log('!!! validToken: ', validToken)
      if (validToken) {
        setInvitationCodes()
        navigation.navigate('Login')
      } else {
        navigation.navigate('InviteExpired')
      }
    })
    .catch(err => navigation.navigate('InviteExpired'))
  }

  render () {
    console.log('!!!in CheckInvitation render !!!')
    return <Loading />
  }
}
