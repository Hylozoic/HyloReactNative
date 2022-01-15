import OneSignal from 'react-native-onesignal'

export async function register ({ registerDevice }) {
  const deviceState = await OneSignal.getDeviceState()
  registerDevice(deviceState?.userId)
}
