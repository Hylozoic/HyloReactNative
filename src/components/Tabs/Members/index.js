import { withNavigationFocus } from '@react-navigation/compat'

import component from './Members'
import connector from './Members.connector'

export default withNavigationFocus(connector(component))
