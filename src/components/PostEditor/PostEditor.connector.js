import { connect } from 'react-redux'
import { createPost, updatePost, setDetails } from './PostEditor.store'
import { get, isEmpty } from 'lodash/fp'
import getPost from '../../store/selectors/getPost'

function getPostId (state, props) {
  return props.navigation.state.params.id
}

export function mapStateToProps (state, props) {
  const communityId = get('navigation.state.params.communityId', props)
  const post = getPost(state, {id: getPostId(state, props)})
  return {
    details: state.PostEditor.details,
    post,
    communityIds: post
      ? post.communities.toRefArray().map(x => x.id)
      : [communityId],
    imageUrls: post
      ? post.images().orderBy(get('position')).toRefArray().map(x => x.url)
      : []
  }
}

export function mapDispatchToProps (dispatch, props) {
  const { navigation } = props
  const postId = getPostId(null, props)
  const saveAction = postId ? updatePost : createPost
  const communityId = get('navigation.state.params.communityId', props)

  return {
    save: postData => {
      if (!postData.title) {
        return Promise.reject(new Error('Title cannot be blank'))
      }

      if (isEmpty(postData.communities)) {
        return Promise.reject(new Error('You must select a community'))
      }

      if (postId) postData.id = postId

      return dispatch(saveAction(postData))
      .then(({ error, payload }) => {
        if (error) {
          // TODO: handle API errors more appropriately
          throw new Error('Error submitting post')
        }
        navigation.goBack()
        return Promise.resolve({})
      })
    },
    editDetails: () => navigation.navigate('DetailsEditor', {communityId}),
    setDetails: content => dispatch(setDetails(content))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
