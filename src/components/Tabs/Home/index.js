import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './Home'
import connector from './Home.connector'

export default connector(withNavigationFocus(component))
