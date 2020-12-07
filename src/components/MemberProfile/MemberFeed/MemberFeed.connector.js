import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  setChoice,
  getChoice,
  fetchMemberPosts,
  fetchMemberComments,
  fetchMemberUpvotes,
  getMemberPosts,
  getHasMoreMemberPosts,
  getMemberComments,
  getHasMoreMemberComments,
  getMemberUpvotes,
  getHasMoreMemberUpvotes,
  FETCH_MEMBER_POSTS,
  FETCH_MEMBER_COMMENTS,
  FETCH_MEMBER_UPVOTES
} from './MemberFeed.store'

export function mapStateToProps (state, props) {
  const choice = getChoice(state, props)
  var items = []
  var itemType, hasMore, pending

  switch (choice) {
    case 'Posts':
      items = getMemberPosts(state, props)
      itemType = 'post'
      hasMore = getHasMoreMemberPosts(state, props)
      pending = state.pending[FETCH_MEMBER_POSTS]
      break
    case 'Comments':
      items = getMemberComments(state, props)
      itemType = 'comment'
      hasMore = getHasMoreMemberComments(state, props)
      pending = state.pending[FETCH_MEMBER_COMMENTS]
      break
    case 'Upvotes':
      items = getMemberUpvotes(state, props)
      itemType = 'post'
      hasMore = getHasMoreMemberUpvotes(state, props)
      pending = state.pending[FETCH_MEMBER_UPVOTES]
      break
  }
  return {
    choice,
    items,
    itemType,
    hasMore,
    pending
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    ...bindActionCreators({
      setChoice,
      fetchMemberPosts,
      fetchMemberComments,
      fetchMemberUpvotes
    }, dispatch),
    showPost: id => navigation.navigate('PostDetails', { id })
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { choice, hasMore, items } = stateProps
  const { id } = ownProps
  const fetchFunction = {
    'Posts': dispatchProps.fetchMemberPosts,
    'Comments': dispatchProps.fetchMemberComments,
    'Upvotes': dispatchProps.fetchMemberUpvotes
  }[choice]

  const offset = items.length

  const fetchItems = () => fetchFunction({id})
  const fetchMoreItems = hasMore
    ? () => fetchFunction({id, offset})
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchItems,
    fetchMoreItems
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
