/**
 * @providesModule util/platform
 */

import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export const isIOS = Platform.OS === 'ios'
export const platformName = isIOS ? 'ios' : 'android'
export const appVersion = DeviceInfo.getVersion()
export const urlPrefix = isIOS ? 'HyloReactNative://' : 'HyloReactNative://HyloReactNative/'
