import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export async function register ({ registerDevice }) {
  const { userId } = await OneSignal.getDeviceState()
  registerDevice(userId)
}
