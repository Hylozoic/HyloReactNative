import component from './Login'
import connector from './Login.connector'
import redirectsAfterLogin from '../redirectsAfterLogin'

export default redirectsAfterLogin(connector(component))
