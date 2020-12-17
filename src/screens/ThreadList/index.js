import { withNavigationFocus } from '@react-navigation/compat'

import component from './ThreadList'
import connector from './ThreadList.connector'

export default withNavigationFocus(connector(component))
