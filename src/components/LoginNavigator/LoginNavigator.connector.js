import { connect } from 'react-redux'
import { getEntryURL, resetEntryURL } from '../SessionCheck/SessionCheck.store'

export function mapStateToProps (state, props) {
  return {
    initialURL: getEntryURL(state, props)
  }
}

export const mapDispatchToProps = {
  getEntryURL,
  resetEntryURL
}

export default connect(mapStateToProps, mapDispatchToProps)
