import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './Topics'
import connector from './Topics.connector'
export default withNavigationFocus(connector(component))
