import { withNavigationFocus } from '@react-navigation/compat'

import component from './PostDetails'
import connector from './PostDetails.connector'

export default withNavigationFocus(connector(component))
