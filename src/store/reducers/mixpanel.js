import { Mixpanel } from 'mixpanel-react-native'

const trackAutomaticEvents = true
const mixpanel = new Mixpanel(process.env.MIXPANEL_TOKEN, trackAutomaticEvents)

mixpanel && mixpanel.init()

export default (state = mixpanel, action) => state
