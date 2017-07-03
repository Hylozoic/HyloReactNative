import { connect } from 'react-redux'
import { setDetails } from '../PostEditor.store'

function mapStateToProps (state, props) {
  return {
    content: state.PostEditor.details
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    saveChanges: details => dispatch(setDetails(details))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
