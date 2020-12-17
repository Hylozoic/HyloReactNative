import component from './Topics'
import connector from './Topics.connector'
import { withNavigationFocus } from '@react-navigation/compat'

export default withNavigationFocus(connector(component))
