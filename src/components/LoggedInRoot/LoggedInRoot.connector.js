import { connect } from 'react-redux'
import fetchCurrentUser from '../../store/actions/fetchCurrentUser'
import registerDevice from '../../store/actions/registerDevice'
import { getEntryURL, resetEntryURL } from '../SessionCheck/SessionCheck.store'

export function mapStateToProps (state, props) {
  return {
    entryURL: getEntryURL(state)
  }
}

const mapDispatchToProps = {
  fetchCurrentUser,
  registerDevice,
  resetEntryURL
}

export default connect(mapStateToProps, mapDispatchToProps)
