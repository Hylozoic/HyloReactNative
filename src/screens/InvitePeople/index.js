import { withNavigationFocus } from '@react-navigation/compat'

import component from './InvitePeople'
import connector from './InvitePeople.connector'

export default withNavigationFocus(connector(component))
