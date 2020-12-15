import { withNavigationFocus } from '@react-navigation/compat'
import component from './MemberProfile'
import connector from './MemberProfile.connector'

export default withNavigationFocus(connector(component))
