import React, { Component } from 'react'
import { Linking } from 'react-native'
import { get, includes } from 'lodash/fp'
import URL from 'url-parse'
import Loading from '../Loading'
import InviteExpired from './InviteExpired'

// TODO: Figure out how to wire a connected component within a HOC
//       while still keeping the unconnected component testable.
import connector from './CheckInvitation.connector'

const JOIN_COMMUNITY_BY_TOKEN_URL = '/h/use-invitation'
// TODO: Need "Route" URL matching to handle these params
const JOIN_COMMUNITY_BY_ACCESS_CODE_URL = '/c/:slug/join/:accessCode'

export default function CheckInvitation (Comp) {
  return connector(
    class extends Component {
      constructor (props) {
        super(props)
        this.state = {invitationToken: null, accessCode: null}
      }

      _handleOpenURL = (url) => {
        const { pathname, query } = URL(url, true)
        if (includes(pathname, [JOIN_COMMUNITY_BY_TOKEN_URL, JOIN_COMMUNITY_BY_ACCESS_CODE_URL])) {
          const invitationCodes = {
            invitationToken: get('token', query),
            accessCode: get('accessCode', query)
          }
          this.setState({invitationCodes})
          this.props.checkInvitation(invitationCodes)
        }
      }

      componentDidMount () {
        // this handles the case where the app is closed and is launched via Universal Linking.
        Linking.getInitialURL()
        .then(url => {
          if (url) this._handleOpenURL(url)
        })
        .catch(e => {})
        // This listener handles the case where the app is woken up from the Universal Linking
        Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))
      }

      componentWillUnmount () {
        Linking.removeEventListener('url', this._handleOpenURL)
      }

      render () {
        const {
          invitationCheckPending,
          hasCheckedValidInvite,
          isValidInvite,
          setInvitationCodes
        } = this.props
        const { invitationCodes } = this.state
        // TODO: Add style for fullscreen loading
        if (invitationCheckPending) return <Loading />
        if (hasCheckedValidInvite) {
          if (!isValidInvite) return <InviteExpired />
          setInvitationCodes(invitationCodes)
        }
        return <Comp {...this.props} />
      }
    }
  )
}
