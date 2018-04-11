import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './InvitePeople'
import connector from './InvitePeople.connector'

export default withNavigationFocus(connector(component))
