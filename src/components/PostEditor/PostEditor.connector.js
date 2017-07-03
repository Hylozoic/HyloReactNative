import { connect } from 'react-redux'
import { createPost, updatePost, setDetails } from './PostEditor.store'
import { get, isEmpty } from 'lodash/fp'

function mapStateToProps (state, props) {
  return {
    communityId: get('navigation.state.params.communityId', props),
    details: state.PostEditor.details
  }
}

function mapDispatchToProps (dispatch, { navigation }) {
  return {
    save: postData => {
      if (!postData.title) {
        return alert('Title cannot be blank')
      }

      if (isEmpty(postData.communities)) {
        return alert('You must select a community')
      }

      return dispatch(createPost(postData))
      .then(({ error, payload }) => {
        if (error) {
          return alert(payload)
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
