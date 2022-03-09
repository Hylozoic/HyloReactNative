import OneSignal from 'react-native-onesignal'

export async function register ({ registerDevice }) {
  const deviceState = await OneSignal.getDeviceState()
  if (deviceState?.userId) {
    registerDevice(deviceState?.userId)
  } else {
    console.log('Note: Not registering to OneSignal for push notifications. OneSignal did not successfully retrieve a userId')
  }
}
