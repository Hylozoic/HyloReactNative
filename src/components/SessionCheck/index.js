import component from './SessionCheck'
import connector from './SessionCheck.connector'
import redirectsAfterLogin from '../redirectsAfterLogin'

export default redirectsAfterLogin(connector(component))
