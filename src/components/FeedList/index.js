import { withNavigationFocus } from '@react-navigation/compat'

import component from './FeedList'
import connector from './FeedList.connector'

export default withNavigationFocus(connector(component))
