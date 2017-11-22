import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './Members'
import connector from './Members.connector'

export default withNavigationFocus(connector(component))
