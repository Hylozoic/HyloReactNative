import React, { Component } from 'react'
import { Linking } from 'react-native'
import { get } from 'lodash/fp'
import URL from 'url-parse'
import Loading from '../Loading'
import JoinCommunity from '../JoinCommunity'

// TODO: Figure out how to wire a connected component within a HOC
//       while still keeping the unconnected component testable.
import connector from './CheckInvitation.connector'

const JOIN_COMMUNITY_BY_TOKEN_URL = '/h/use-invitation'

// TODO: Need "Route" URL matching to handle these params
// const JOIN_COMMUNITY_BY_ACCESS_CODE_URL = '/c/:slug/join/:accessCode'

export default function CheckInvitation (Comp) {
  return connector(
    class extends Component {
      _handleOpenURL = (url) => {
        const { pathname, query } = URL(url, true)
        if (pathname === JOIN_COMMUNITY_BY_TOKEN_URL) {
          console.log('!!! Join Community URL matched: ', get('token', query) || get('accessCode', query))
          this.props.checkInvitation({
            invitationToken: get('token', query),
            accessCode: get('accessCode', query)
          })
        }
      }

      componentDidMount () {
        // this handles the case where the app is closed and is launched via Universal Linking.
        Linking.getInitialURL()
        .then((url) => {
          if (url) {
            this._handleOpenURL(url)
          }
        })
        .catch((e) => {})
        // This listener handles the case where the app is woken up from the Universal Linking
        Linking.addEventListener('url', ({ url }) => this._handleOpenURL(url))
      }

      componentWillUnmount () {
        Linking.removeEventListener('url', this._handleOpenURL)
      }

      render () {
        const { invitationCheckPending, hasCheckedValidInvite, isValidInvite } = this.props
        // TODO: Add style for fullscreen loading
        // TODO: Create <InvalidInviteErrorPage />
        if (invitationCheckPending) return <Loading />
        if (hasCheckedValidInvite) {
          // TODO: Push inviteToken, accessCode onto JoinCommunity props
          if (isValidInvite) return <JoinCommunity />
          //     return <InvalidInviteErrorPage />
        }
        return <Comp {...this.props} />
      }
    }
  )
}
