import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './MemberProfile'
import connector from './MemberProfile.connector'
export default withNavigationFocus(connector(component))
