import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export function register ({ registerDevice }) {
  OneSignal.getPermissionSubscriptionState(({ userId, hasPrompted }) => {
    registerDevice(userId)
    if (isIOS && !hasPrompted) OneSignal.registerForPushNotifications()
  })
}
