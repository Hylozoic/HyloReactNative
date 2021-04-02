import { isIOS } from 'util/platform'
import { isDev } from 'config'

const androidHost = isDev && !isIOS &&
  (process.env.API_HOST_ANDROID || process.env.API_HOST_ANDROID_EMULATOR)
const iosHost = isDev && isIOS &&
  (process.env.API_HOST_IOS || process.env.API_HOST_IOS_EMULATOR)
// Allows option of configuring .env with both an API_HOST,
// which is used in QA and production builds, and a
// API_HOST_DEV in which is used in the development environment
// and builds
const devHost = isDev && process.env.API_HOST_DEV
const HOST = androidHost || iosHost || devHost || process.env.API_HOST_OVERRIDE || process.env.API_HOST

export default HOST

if (isDev) console.log(`API host: ${HOST}`)
