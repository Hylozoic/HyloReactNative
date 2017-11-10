import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './Feed'
import connector from './Feed.connector'

export default connector(withNavigationFocus(component))
