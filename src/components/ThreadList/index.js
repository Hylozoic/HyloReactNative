import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './ThreadList'
import connector from './ThreadList.connector'

export default connector(withNavigationFocus(component))
