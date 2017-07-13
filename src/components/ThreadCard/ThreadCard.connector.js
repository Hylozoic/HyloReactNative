import { connect } from 'react-redux'
import getMe from '../../store/selectors/getMe'

function mapStateToProps (state) {
  const currentUser = getMe(state)
  return {
    currentUser
  }
}

export default connect(mapStateToProps)
