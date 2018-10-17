import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './Projects'
import connector from './Projects.connector'
export default withNavigationFocus(connector(component))
