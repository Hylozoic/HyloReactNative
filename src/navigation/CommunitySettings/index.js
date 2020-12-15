import { withNavigationFocus } from '@react-navigation/compat'
import component from './CommunitySettings.js'
import connector from './CommunitySettings.connector.js'

export default withNavigationFocus(connector(component))
