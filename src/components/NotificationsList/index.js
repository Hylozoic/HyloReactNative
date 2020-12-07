import { withNavigationFocus } from '@react-navigation/compat'

import component from './NotificationsList'
import connector from './NotificationsList.connector'

export default withNavigationFocus(connector(component))
