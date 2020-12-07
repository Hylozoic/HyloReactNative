import { withNavigation } from '@react-navigation/compat'

import PostHeader from './PostHeader'
import connector from './PostHeader.connector'

export default withNavigation(connector(PostHeader))
