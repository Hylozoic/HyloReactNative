import { withNavigationFocus } from '@react-navigation/compat'
import component from './MemberDetails'
import connector from './MemberDetails.connector'

export default withNavigationFocus(connector(component))