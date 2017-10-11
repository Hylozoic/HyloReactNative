/**
 * @providesModule util/platform
 */

import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'

// export const platformName = isIOS ? 'ios' : 'android'
export const platformName = 'ios'
export const appVersion = 1.6
export const urlPrefix = isIOS ? 'HyloReactNative://' : 'HyloReactNative://HyloReactNative/'
