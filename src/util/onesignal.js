import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export async function register ({ registerDevice }) {
  const test = await OneSignal.getDeviceState()
  registerDevice(test?.userId)
}
