import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './CommunitySettings.js'
import connector from './CommunitySettings.connector.js'
export default withNavigationFocus(connector(component))
