import { withNavigationFocus } from '@react-navigation/compat'
import component from './GroupSettings.js'
import connector from './GroupSettings.connector.js'

export default withNavigationFocus(connector(component))
