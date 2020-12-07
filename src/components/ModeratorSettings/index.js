import { withNavigationFocus } from '@react-navigation/compat'

import component from './ModeratorSettings'
import connector from './ModeratorSettings.connector'

export default withNavigationFocus(connector(component))
