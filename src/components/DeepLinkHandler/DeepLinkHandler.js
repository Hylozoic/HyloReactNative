import React from 'react'
import { Linking } from 'react-native'
import { parse } from 'url'
import { isInvitationLink, redirectAfterLogin, resetToRoute } from 'util/navigation'
import convertDeepLinkToAction from './convertDeepLinkToAction'
import OneSignal from 'react-native-onesignal'
import { isDev } from 'util/testing'

export default class DeepLinkHandler extends React.Component {
  async componentDidMount () {
    const { currentUser, initialPushNotificationEvent, navigator } = this.props

    // regardless of whether there is a deep link, we have to change the initial
    // route to one of these -- otherwise we could open a screen for a deep link
    // that has a back button that takes you back to an endless loading screen
    if (currentUser) {
      resetToRoute(navigator, 'Main')
    } else {
      resetToRoute(navigator, 'Login')
    }

    if (initialPushNotificationEvent) {
      this.handlePushNotificationEvent(initialPushNotificationEvent)
    } else {
      const initialUrl = await Linking.getInitialURL()
      if (initialUrl) this.handleUrl(initialUrl)
    }

    Linking.addEventListener('url', this.handleLinkingEvent)
    OneSignal.addEventListener('opened', this.handlePushNotificationEvent)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleLinkingEvent)
    OneSignal.removeEventListener('opened', this.handlePushNotificationEvent)
  }

  handlePushNotificationEvent = ({ notification }) => {
    return this.handleUrl(notification.payload.additionalData.path)
  }

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
    if (isDev) console.log(`handling deep link "${path}" with action:`, action)
    if (!action) return

    if (currentUser) {
      // if you're already logged in, redirect immediately.
      this.redirectNow(action)
    } else {
      // you should already be at the Login screen now
      storeNavigationAction(action)
      if (isInvitationLink(path)) this.redirectNow(action)
    }
  }

  render () {
    return null
  }
}
