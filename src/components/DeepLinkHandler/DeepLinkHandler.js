import React from 'react'
import { InteractionManager, Linking } from 'react-native'
// import { URL } from 'url'
import * as url from 'url'


import {
  isInvitationLink, redirectAfterLogin, resetToRoute, resetToMainRoute
} from 'util/navigation'
import convertDeepLinkToAction from './convertDeepLinkToAction'
import { isDev } from 'util/testing'

export default class DeepLinkHandler extends React.Component {
  async componentDidMount () {
    Linking.addEventListener('url', this.handleLinkingEvent)

    // even if there is a deep link, we still have to change the initial route
    // to one of these. otherwise, the back button on the deep-linked screen
    // will just take you back to a permanent loading screen.
    if (this.props.currentUser) {
      resetToMainRoute(this.props.navigator)
    } else {
      resetToRoute(this.props.navigator, 'Login')
    }

    const pushNotification = this.props.onesignalNotification
    if (pushNotification) {
      return InteractionManager.runAfterInteractions(
        () => this.handlePushNotification(pushNotification)
      )
    }

    const initialUrl = this.props.initialUrl || await Linking.getInitialURL()
    if (initialUrl) {
      return InteractionManager.runAfterInteractions(
        () => this.handleUrl(initialUrl)
      )
    }
  }

  componentDidUpdate (prevProps) {
    const { onesignalNotification } = this.props
    if (onesignalNotification !== prevProps.onesignalNotification) {
      InteractionManager.runAfterInteractions(
        () => this.handlePushNotification(onesignalNotification)
      )
    }
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handleLinkingEvent)
  }

  handlePushNotification = ({ additionalData: { path } }) => this.handleUrl(path)

  handleLinkingEvent = ({ url }) => this.handleUrl(url)

  redirectNow (action) {
    const { currentUser, navigator } = this.props
    return redirectAfterLogin({currentUser, navigation: navigator, action})
  }

  handleUrl (requestUrl) {
    if (!requestUrl) return

    const { storeNavigationAction, currentUser } = this.props

    const path = requestUrl.match(/^http/) ? url.parse(requestUrl).path : url.parse(requestUrl, 'hyloapp://test').path

    const action = convertDeepLinkToAction(path)
    if (!action) return
    const nextAction = action.params && action.params.nextURL
      ? convertDeepLinkToAction(decodeURIComponent(action.params.nextURL))
      : action
    if (isDev) console.log(`handling deep link "${path}" with action:`, action)
    if (!currentUser) {
      storeNavigationAction(nextAction)
      if (action.params && action.params.nextURL) {
        this.redirectNow(action)
      }
    }
    if (currentUser || isInvitationLink(path)) {
      this.redirectNow(nextAction)
    }
  }

  render () {
    return null
  }
}
