import { Platform } from 'react-native'
import { API_HOST, IOS_EMULATOR_API_HOST, ANDROID_EMULATOR_API_HOST } from 'react-native-dotenv'
import { getSessionCookie } from './session'
import DeviceInfo from 'react-native-device-info'

const HOST = DeviceInfo.isEmulator() ? (Platform.OS === 'ios' ? IOS_EMULATOR_API_HOST : ANDROID_EMULATOR_API_HOST) : API_HOST

export default function fetchGraphQL (query) {
  return getSessionCookie()
  .then(cookie =>
    fetch(`${HOST}/noo/graphql`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: JSON.stringify({query})
    }))
  .then(resp => resp.json())
  .then(json => json.data)
}
