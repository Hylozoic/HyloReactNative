import connector from './DeepLinkHandler.connector'
import component from './DeepLinkHandler'
import redirectsAfterLogin from '../redirectsAfterLogin'
export default redirectsAfterLogin(connector(component))
