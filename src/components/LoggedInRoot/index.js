import { connect } from 'react-redux'
import fetchCurrentUser from '../store/actions/fetchCurrentUser'
import registerDevice from '../store/actions/registerDevice'
import LoggedInRoot from './LoggedInRoot'

const mapDispatchToProps = {fetchCurrentUser, registerDevice}
export default connect(null, mapDispatchToProps)(LoggedInRoot)
