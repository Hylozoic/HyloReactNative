import { connect } from 'react-redux'
import { setEntryUrl } from '../SessionCheck/SessionCheck.store'
import getMe from 'store/selectors/getMe'

function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

const mapDispatchToProps = {setEntryUrl}

export default connect(mapStateToProps, mapDispatchToProps)
