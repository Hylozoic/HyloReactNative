import component from './Members'
import connector from './Members.connector'
import { withNavigationFocus } from '@react-navigation/compat'

export default withNavigationFocus(connector(component))
