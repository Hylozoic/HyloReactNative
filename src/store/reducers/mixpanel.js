import { Mixpanel } from 'mixpanel-react-native'

import { isDev, isProduction } from 'config'

let mixpanel = null

if (isDev && process.env.MIXPANEL_TOKEN_DEV) {
  mixpanel = new Mixpanel(process.env.MIXPANEL_TOKEN_DEV)
} else if (isProduction) {
  mixpanel = new Mixpanel(process.env.MIXPANEL_TOKEN)
}

mixpanel && mixpanel.init()

export default (state = mixpanel, action) => state
