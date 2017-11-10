import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './NotificationsList'
import connector from './NotificationsList.connector'

export default connector(withNavigationFocus(component))
