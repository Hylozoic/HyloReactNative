import { connect } from 'react-redux'
import { getShouldDisplay } from './LoadingModal.store'

export function mapStateToProps (state, props) {
  const shouldDisplay = getShouldDisplay(state)
  return {
    shouldDisplay
  }
}

export default connect(mapStateToProps)
