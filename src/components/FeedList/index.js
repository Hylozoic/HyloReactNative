import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './FeedList'
import connector from './FeedList.connector'

export default withNavigationFocus(connector(component))
