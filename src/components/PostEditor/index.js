import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './PostEditor'
import connector from './PostEditor.connector'

export default withNavigationFocus(connector(component))
