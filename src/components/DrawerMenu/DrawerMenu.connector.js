import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'
import getMemberships from '../../store/selectors/getMemberships'
import { logout } from '../Login/actions'
import changeCommunity from '../../store/actions/changeCommunity'

function mapStateToProps (state) {
  return {
    currentUser: getMe(state),
    memberships: getMemberships(state)
  }
}

const mapDispatchToProps = {logout, changeCommunity}

export default connect(mapStateToProps, mapDispatchToProps)
