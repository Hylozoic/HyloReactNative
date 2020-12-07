import { withNavigationFocus } from '@react-navigation/compat'

import component from './Projects'
import connector from './Projects.connector'
export default withNavigationFocus(connector(component))
