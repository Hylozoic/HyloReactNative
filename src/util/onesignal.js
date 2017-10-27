/**
 * @providesModule util/onesignal
 */

import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export function init ({ registerDevice }) {
  OneSignal.getPermissionSubscriptionState(({ userId, hasPrompted }) => {
    registerDevice(userId)
    if (isIOS && !hasPrompted) OneSignal.registerForPushNotifications()
  })

  // from these event listeners, we can handle setting up and navigating to the
  // corresponding parts of the application

  OneSignal.addEventListener('received', notification => {
    console.log('OneSignal event: received')
    console.log(notification)
  })

  OneSignal.addEventListener('opened', result => {
    console.log('OneSignal event: opened')
    console.log(result)
  })

  OneSignal.inFocusDisplaying(0)
}
