/**
 * @providesModule util/apiHost
 */

import { isIOS } from 'util/platform'
import { isDev, isProduction } from '../config'

const androidHost = isDev && !isIOS &&
  (process.env.ANDROID_API_HOST || process.env.ANDROID_EMULATOR_API_HOST)
const iosHost = isDev && isIOS &&
  (process.env.IOS_API_HOST || process.env.IOS_EMULATOR_API_HOST)
// Allows option of configuring .env with both an API_HOST,
// which is used in QA and production builds, and a
// DEV_API_HOST in which is used in the development environment
// and builds
const devHost = isDev && process.env.DEV_API_HOST
const HOST = androidHost || iosHost || devHost || process.env.API_HOST

export default HOST

if (process.env.NODE_ENV === 'development') console.log(`API host: ${HOST}`)
