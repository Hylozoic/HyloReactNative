import { connect } from 'react-redux'
import { createPost, updatePost, setDetails } from './PostEditor.store'

function mapStateToProps (state, props) {
  return {
    details: state.PostEditor.details
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    save: postData => {
      // TODO validate and create/update
      alert('TODO')
    },
    editDetails: () => {
      return props.navigation.navigate('DetailsEditor')
    },
    setDetails: content => dispatch(setDetails(content))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
