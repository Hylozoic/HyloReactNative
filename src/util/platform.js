/**
 * @providesModule util/platform
 */

import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'

// TODO: only used for createLinkingAwareContainer and should be a function
// smart enough to parse and send any prefix passed through from iOS or Android
// (the handling of that piece whether http/s or www vs without www vs applinks://
// is the business of config at that level).
export const urlPrefix = 'http://hylo.com/'
