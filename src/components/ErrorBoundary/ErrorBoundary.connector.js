import { connect } from 'react-redux'
import logError from '../../store/actions/logError'

export const mapDispatchToProps = {
  logError
}

export default connect(null, mapDispatchToProps)
