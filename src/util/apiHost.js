import { isIOS } from 'util/platform'

const androidHost = __DEV__ && !isIOS &&
  (process.env.ANDROID_API_HOST || process.env.ANDROID_EMULATOR_API_HOST)
const iosHost = __DEV__ && isIOS &&
  (process.env.IOS_API_HOST || process.env.IOS_EMULATOR_API_HOST)

const HOST = androidHost || iosHost || process.env.API_HOST
export default HOST

if (__DEV__) console.log(`API host: ${HOST}`)
