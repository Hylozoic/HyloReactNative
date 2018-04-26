import { withNavigationFocus } from 'react-navigation'

import component from './Feed'
import connector from './Feed.connector'

export default withNavigationFocus(connector(component))
