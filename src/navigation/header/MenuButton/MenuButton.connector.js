import { connect } from 'react-redux'
import getCurrentGroup from 'store/selectors/getCurrentGroup'

export function mapStateToProps (state) {
  return {
    currentContext: getCurrentGroup(state)
  }
}

export default connect(mapStateToProps)
