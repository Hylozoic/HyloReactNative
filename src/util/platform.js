/**
 * @providesModule util/platform
 */

import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'

export const urlPrefix = isIOS ? 'HyloReactNative://' : 'HyloReactNative://HyloReactNative/'
