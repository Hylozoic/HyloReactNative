import OneSignal from 'react-native-onesignal'
import { isIOS } from 'util/platform'

export async function register ({ registerDevice }) {
  const deviceState = await OneSignal.getDeviceState()
  registerDevice(deviceState?.userId)
}
