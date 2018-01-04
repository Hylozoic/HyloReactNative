import React from 'react'
import { Linking } from 'react-native'
import { get } from 'lodash/fp'
import { parse } from 'url'
import {
  isInvitationLink, redirectAfterLogin, resetToRoute, resetToMainRoute
} from 'util/navigation'
import convertDeepLinkToAction from './convertDeepLinkToAction'
import OneSignal from 'react-native-onesignal'
import { isDev } from 'util/testing'

export default class DeepLinkHandler extends React.Component {
  async componentDidMount () {
    Linking.addEventListener('url', this.handleLinkingEvent)
    OneSignal.addEventListener('opened', this.handlePushNotificationEvent)

    // even if there is a deep link, we still have to change the initial route
    // to one of these. otherwise, the back button on the deep-linked screen
    // will just take you back to a permanent loading screen.
    if (this.props.currentUser) {
      resetToMainRoute(this.props.navigator)
    } else {
      resetToRoute(this.props.navigator, 'Login')
    }

    const event = this.props.initialPushNotificationEvent
    if (event) {
      return setImmediate(() => this.handlePushNotificationEvent(event))
    }

    const initialUrl = this.props.initialUrl || await Linking.getInitialURL()
    if (initialUrl) {
      return setImmediate(() => this.handleUrl(initialUrl))
    }
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleLinkingEvent)
    OneSignal.removeEventListener('opened', this.handlePushNotificationEvent)
  }

  handlePushNotificationEvent = ({ notification }) =>
    this.handleUrl(notification.payload.additionalData.path)

  handleLinkingEvent = ({ url }) => this.handleUrl(url)

  redirectNow (action) {
    const { currentUser, navigator } = this.props
    return redirectAfterLogin({currentUser, navigation: navigator, action})
  }

  handleUrl (url) {
    if (!url) return

    const { storeNavigationAction, currentUser } = this.props
    const { path } = parse(url)
    const action = convertDeepLinkToAction(path)
    if (!action) return
    const nextAction = action.params.nextURL
      ? convertDeepLinkToAction(decodeURIComponent(action.params.nextURL))
      : action
    if (isDev) console.log(`handling deep link "${path}" with action:`, action)
    if (!currentUser) {
      storeNavigationAction(nextAction)
      if (action.params.nextURL) {
        this.redirectNow(action)
      }
    }
    if (currentUser || isInvitationLink(path)) {
      this.redirectNow(nextAction)
    }
  }

  // if (currentUser) {
  //   // redirect immediately if you're already logged in,
  //   // have a loginToken or if this is an invitationLink
  //   //
  //   // TODO: CHECK -- Might need to storeNavigationAction even if currentUser
  //   // in the case of invitationLinks
  //   // if (isInvitationLink(path)) storeNavigationAction(nextAction)
  //   //
  //   // you should already be at the Login screen now
  //   this.redirectNow(action)
  // } else if (isInvitationLink(path) || action.params.loginToken) {
  //   storeNavigationAction(nextAction)
  // }

  render () {
    return null
  }
}
