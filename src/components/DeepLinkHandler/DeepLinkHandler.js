import React from 'react'
import { Linking } from 'react-native'
import { get } from 'lodash/fp'
import { parse } from 'url'
import { isInvitationLink } from 'util/navigation'
import convertDeepLinkToAction from './convertDeepLinkToAction'

export default class DeepLinkHandler extends React.Component {
  componentWillMount () {
    Linking.getInitialURL().then(this.handleUrl)
    Linking.addEventListener('url', this.handleUrl)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleUrl)
  }

  handleUrl = eventOrUrl => {
    const url = get('url', eventOrUrl) || eventOrUrl
    if (!url) return

    const { storeDeepLink, currentUser, navigator, redirectNow } = this.props
    const { path } = parse(url)
    const action = convertDeepLinkToAction(path)
    console.log('convertEntryUrlToAction:', path, action)

    if (currentUser) {
      // if you're already logged in, redirect immediately.
      redirectNow({
        currentUser,
        navigation: navigator,
        deepLink: action
      })
    } else {
      storeDeepLink(action)

      if (isInvitationLink(path)) {
        redirectNow({
          currentUser: null,
          navigation: navigator,
          deepLink: action
        })
      }
    }
  }

  render () {
    return null
  }
}
