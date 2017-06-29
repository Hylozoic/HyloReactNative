import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createPost, updatePost } from './PostEditor.store'

function mapStateToProps (state, props) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    ...bindActionCreators({
      createPost,
      updatePost
    }, dispatch),
    save: () => console.log('save tapped')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
