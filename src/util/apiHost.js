/**
 * @providesModule util/apiHost
 */

import { isIOS } from 'util/platform'
import { isDev } from '../config'

const androidHost = isDev && !isIOS &&
  (process.env.ANDROID_API_HOST || process.env.ANDROID_EMULATOR_API_HOST)
const iosHost = isDev && isIOS &&
  (process.env.IOS_API_HOST || process.env.IOS_EMULATOR_API_HOST)

const HOST = androidHost || iosHost || process.env.API_HOST
export default HOST

if (process.env.NODE_ENV === 'development') console.log(`API host: ${HOST}`)
