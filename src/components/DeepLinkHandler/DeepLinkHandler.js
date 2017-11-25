import React from 'react'
import { Linking } from 'react-native'
import { parse } from 'url'
import { isInvitationLink, redirectAfterLogin } from 'util/navigation'
import convertDeepLinkToAction from './convertDeepLinkToAction'

export default class DeepLinkHandler extends React.Component {
  componentWillMount () {
    Linking.getInitialURL().then(this.handleUrl)
    Linking.addEventListener('url', this.handleLinkingEvent)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleLinkingEvent)
  }

  handleLinkingEvent = ({ url }) => this.handleUrl(url)

  redirectNow (action) {
    const { currentUser, navigator } = this.props
    return redirectAfterLogin({currentUser, navigation: navigator, action})
  }

  handleUrl = url => {
    if (!url) return

    const { storeNavigationAction, currentUser } = this.props
    const { path } = parse(url)
    const action = convertDeepLinkToAction(path)
    console.log('handling deep link:', path, action)
    if (!action) return

    if (currentUser) {
      // if you're already logged in, redirect immediately.
      this.redirectNow(action)
    } else {
      storeNavigationAction(action)
      if (isInvitationLink(path)) this.redirectNow(action)
    }
  }

  render () {
    return null
  }
}
