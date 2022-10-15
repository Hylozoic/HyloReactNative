import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { modalScreenName } from 'navigation/linking/helpers'
import makeGoToGroup from 'store/actions/makeGoToGroup'
import respondToEvent from 'store/actions/respondToEvent'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getMemberships from 'store/selectors/getMemberships'
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
  let items = []
  let itemType, hasMore, pending
  const currentGroupId = getCurrentGroupId(state)
  const memberships = getMemberships(state)

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
    currentGroupId,
    memberships,
    pending
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    ...bindActionCreators({
      setChoice,
      fetchMemberPosts,
      fetchMemberComments,
      fetchMemberUpvotes,
      respondToEvent
    }, dispatch),
    goToGroup: makeGoToGroup(navigation, dispatch),
    showMember: id => navigation.navigate('Member', { id }),
    showPost: id => navigation.navigate(modalScreenName('Post Details'), { id }),
    showTopic: topicName => navigation.navigate('Topic Feed', { topicName })
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { choice, hasMore, items, currentGroupId, memberships } = stateProps
  const { id } = ownProps
  const fetchFunction = {
    Posts: dispatchProps.fetchMemberPosts,
    Comments: dispatchProps.fetchMemberComments,
    Upvotes: dispatchProps.fetchMemberUpvotes
  }[choice]

  const offset = items.length || 0

  const fetchItems = () => fetchFunction({ id })
  const fetchMoreItems = hasMore
    ? () => fetchFunction({ id, offset })
    : () => {}
  const goToGroup = groupId => dispatchProps.goToGroup(groupId, memberships, currentGroupId)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchItems,
    fetchMoreItems,
    goToGroup
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
