import { MixpanelInstance } from 'react-native-mixpanel'

const mixpanel = new MixpanelInstance(process.env['MIXPANEL_TOKEN'])

export default (state = mixpanel, action) => state
