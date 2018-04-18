import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './ModeratorSettings'
import connector from './ModeratorSettings.connector'

export default withNavigationFocus(connector(component))
