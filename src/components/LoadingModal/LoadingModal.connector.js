import { connect } from 'react-redux'
import { getDisplay } from './LoadingModal.store'

export function mapStateToProps (state, props) {
  const display = getDisplay(state)
  return {
    display
  }
}

export default connect(mapStateToProps)
