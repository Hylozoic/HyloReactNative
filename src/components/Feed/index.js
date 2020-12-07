import { withNavigationFocus } from '@react-navigation/compat'

import component from './Feed'
import connector from './Feed.connector'

export default withNavigationFocus(connector(component))
