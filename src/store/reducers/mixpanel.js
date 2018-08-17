import { MixpanelInstance } from 'react-native-mixpanel'

const mixpanel = new MixpanelInstance(process.env.MIXPANEL_KEY)

const initializeMixpanel = async () => {
  await mixpanel.initialize()
}

const getInitialState = () => {
  initializeMixpanel()
  return mixpanel
}

export default async (state = getInitialState(), action) => state
