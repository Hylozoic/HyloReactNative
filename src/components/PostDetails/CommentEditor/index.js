import { withNavigationFocus } from 'react-navigation-is-focused-hoc'

import component from './CommentEditor'
import connector from './CommentEditor.connector'

export default withNavigationFocus(connector(component))
