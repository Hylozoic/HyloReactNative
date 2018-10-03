import { withNavigationFocus } from 'react-navigation'

import component from './ProjectMembers'
import connector from './ProjectMembers.connector'

export default withNavigationFocus(connector(component))
