/**
 * @providesModule util/platform
 */

import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'

// TODO: I need to figure-out how to handle all the variants (http/s, www vs .) appropiately
export const urlPrefix = isIOS ? 'http://hylo.com/' : 'http://hylo.com/'
// 'HyloReactNative://HyloReactNative/'
