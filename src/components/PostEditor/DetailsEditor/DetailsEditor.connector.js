import { connect } from 'react-redux'
import { setDetails } from '../PostEditor.store'

export function mapStateToProps (state, props) {
  return {
    initialContent: state.PostEditor.details,
    isFocused: props.isFocused
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    saveChanges: details => dispatch(setDetails(details))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
