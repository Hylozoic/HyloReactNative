import { withNavigationFocus } from '@react-navigation/compat'

import component from './Topics'
import connector from './Topics.connector'
export default withNavigationFocus(connector(component))
