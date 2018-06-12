import { withNavigationFocus } from 'react-navigation'

import component from './PostDetails'
import connector from './PostDetails.connector'

export default withNavigationFocus(connector(component))
