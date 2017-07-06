import { connect } from 'react-redux'
import { createPost, updatePost, setDetails } from './PostEditor.store'
import { get, isEmpty } from 'lodash/fp'
import getPost from '../../store/selectors/getPost'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

function mapStateToProps (state, props) {
  return {
    communityId: get('navigation.state.params.communityId', props),
    details: state.PostEditor.details,
    post: getPost(state, {id: getPostId(state, props)})
  }
}

function mapDispatchToProps (dispatch, props) {
  const { navigation } = props
  const postId = getPostId(null, props)
  const saveAction = postId ? updatePost : createPost

  return {
    save: postData => {
      if (!postData.title) {
        return alert('Title cannot be blank')
      }

      if (isEmpty(postData.communities)) {
        return alert('You must select a community')
      }

      if (postId) postData.id = postId

      return dispatch(saveAction(postData))
      .then(({ error, payload }) => {
        if (error) {
          return alert(payload.message)
        }
        return navigation.goBack()
      })
    },
    editDetails: () => {
      return navigation.navigate('DetailsEditor')
    },
    setDetails: content => dispatch(setDetails(content))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
