import Mixpanel from 'react-native-mixpanel'

const mixpanel = Mixpanel.sharedInstanceWithToken("0c3b277514b71b3520723f87fea9c6ad")

export default (state = mixpanel, action) => state
