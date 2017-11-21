import connector from './EntryLinkHandler.connector'
import component from './EntryLinkHandler'
import redirectsAfterLogin from '../redirectsAfterLogin'
export default redirectsAfterLogin(connector(component))
