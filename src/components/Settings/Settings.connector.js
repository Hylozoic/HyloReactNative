import { logout } from '../Login/actions'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    socketStatus: safeStringify(state.SocketListener, '  ')
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    logout: () => dispatch(logout()),
    close: () => props.navigation.dispatch({type: 'Navigation/BACK'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)

function safeStringify (obj, space) {
   let cache = []

   const stringified = JSON.stringify(obj, function (key, value) {
     if (typeof value === 'object' && value !== null) {
       if (cache.indexOf(value) !== -1) {
         return
       }
       cache.push(value)
     }
     return value
   }, space)
   cache = null

   return stringified
 }
