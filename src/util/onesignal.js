/**
 * @providesModule util/onesignal
 */

import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export function init ({ receivePushNotification }) {
  // from these event listeners, we can handle setting up and navigating to the
  // corresponding parts of the application

  OneSignal.addEventListener('received', receivePushNotification)
  OneSignal.inFocusDisplaying(0)
}

export function register ({ registerDevice }) {
  OneSignal.getPermissionSubscriptionState(({ userId, hasPrompted }) => {
    registerDevice(userId)
    if (isIOS && !hasPrompted) OneSignal.registerForPushNotifications()
  })
}
