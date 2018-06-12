import { withNavigationFocus } from 'react-navigation'

import component from './FeedList'
import connector from './FeedList.connector'

export default withNavigationFocus(connector(component))
