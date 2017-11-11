import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './DetailsEditor'
import connector from './DetailsEditor.connector'

export default withNavigationFocus(connector(component))
