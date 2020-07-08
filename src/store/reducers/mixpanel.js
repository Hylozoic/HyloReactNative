import { MixpanelInstance } from 'react-native-mixpanel'
import { isDev, isProduction } from 'config'

let mixpanel = null

if (isDev && process.env.MIXPANEL_TOKEN_DEV) {
  mixpanel = new MixpanelInstance(process.env.MIXPANEL_TOKEN_DEV)
} else if (isProduction) {
  mixpanel = new MixpanelInstance(process.env.MIXPANEL_TOKEN)
}

mixpanel.initialize()

export default (state = mixpanel, action) => state
