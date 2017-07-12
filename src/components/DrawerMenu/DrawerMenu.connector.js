import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import { logout } from '../Login/actions'
import changeCommunity from '../../store/actions/changeCommunity'

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser,
    memberships: currentUser ? currentUser.memberships.toModelArray() : []
  }
}

const mapDispatchToProps = {logout, changeCommunity}

export default connect(mapStateToProps, mapDispatchToProps)
