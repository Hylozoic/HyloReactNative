import { withNavigationFocus } from '@react-navigation/compat'

import component from './PostEditor'
import connector from './PostEditor.connector'

export default withNavigationFocus(connector(component))
