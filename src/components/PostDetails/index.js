import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './PostDetails'
import connector from './PostDetails.connector'

export default withNavigationFocus(connector(component))
