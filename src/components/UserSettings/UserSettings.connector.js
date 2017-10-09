import { logout } from '../Login/actions'
import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    logout: () => dispatch(logout()),
    cancel: () => props.navigation.goBack(),
    saveChanges: () => console.log('Save Changes')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
