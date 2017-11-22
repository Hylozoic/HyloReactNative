import React from 'react'
import { Linking } from 'react-native'
import { get } from 'lodash/fp'
import { parse } from 'url'
import { isInvitationLink } from 'util/navigation'

export default class EntryLinkHandler extends React.Component {
  componentWillMount () {
    Linking.getInitialURL().then(this.handleUrl)
    Linking.addEventListener('url', this.handleUrl)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleUrl)
  }

  handleUrl = eventOrUrl => {
    const { setEntryUrl, currentUser, navigator, redirectNow } = this.props

    const url = get('url', eventOrUrl) || eventOrUrl
    if (!url) return

    const { path } = parse(url)

    if (currentUser) {
      // if you're already logged in, redirect immediately.
      redirectNow({
        currentUser,
        navigation: navigator,
        entryUrl: path
      })
    } else {
      setEntryUrl(path)

      if (isInvitationLink(path)) {
        redirectNow({
          currentUser: null,
          navigation: navigator,
          entryUrl: path
        })
      }
    }
  }

  render () {
    return null
  }
}
