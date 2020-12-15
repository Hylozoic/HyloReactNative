import component from './Projects'
import connector from './Projects.connector'
import { withNavigationFocus } from '@react-navigation/compat'

export default withNavigationFocus(connector(component))
