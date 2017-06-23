import { connect } from 'react-redux'
import { createPost, updatePost } from './PostEditor.store'

function mapStateToProps (state, props) {
  
}

const mapDispatchToProps = {createPost, updatePost}

export default connect(mapStateToProps, mapDispatchToProps)
