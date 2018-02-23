import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './MemberDetails'
import connector from './MemberDetails.connector'
export default withNavigationFocus(connector(component))
