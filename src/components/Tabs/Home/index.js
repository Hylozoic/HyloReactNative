import { withNavigationFocus } from '@react-navigation/compat'

import component from './Home'
import connector from './Home.connector'

export default withNavigationFocus(connector(component))
