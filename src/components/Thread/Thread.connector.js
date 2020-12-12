import { connect } from 'react-redux'
import { sanitize } from 'hylo-utils/text'
import {
  createMessage,
  fetchMessages,
  FETCH_MESSAGES,
  getAndPresentMessages,
  getHasMoreMessages,
  getThread,
  presentThread,
  updateThreadReadTime
} from './Thread.store'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import getCurrentUserId from '../../store/selectors/getCurrentUserId'
import getCurrentNetworkId from '../../store/selectors/getCurrentNetworkId'
import getCurrentCommunityId from '../../store/selectors/getCurrentCommunityId'
import { sendIsTyping } from 'util/websockets'

export function mapStateToProps (state, props) {
  const currentUserId = getCurrentUserId(state)
  const communityId = getCurrentCommunityId(state)
  const networkId = getCurrentNetworkId(state)
  const { id, title } = presentThread(getThread(state, props), currentUserId) || {}
  const messages = getAndPresentMessages(state, props)
  return {
    id,
    currentUserId,
    communityId,
    networkId,
    hasMore: getHasMoreMessages(state, { id }),
    messages,
    pending: state.pending[FETCH_MESSAGES],
    title,
    isConnected: state.SocketListener.connected
  }
}

export function mapDispatchToProps (dispatch, { navigation, route }) {
  const threadId = route.params.id
  return {
    createMessage: text => dispatch(createMessage(threadId, sanitize(text))),
    fetchMessages: cursor => dispatch(fetchMessages(threadId, { cursor })),
    reconnectFetchMessages: () => dispatch(fetchMessages(threadId, { reset: true })),
    sendIsTyping: () => sendIsTyping(threadId, true),
    updateThreadReadTime: () => dispatch(updateThreadReadTime(threadId)),
    showMember: id => navigation.navigate('MemberProfile', { id }),
    showTopic: (communityId, networkId) => topicName => {
      // All Communities and Network feed to topic nav
      // currently not supported
      if (networkId || communityId === ALL_COMMUNITIES_ID) {
        navigation.navigate('TopicSupportComingSoon')
      } else {
        navigation.navigate('Feed', { communityId, topicName })
      }
    }
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { navigation } = ownProps
  const { id, title, communityId, networkId } = stateProps
  const setNavParams = title
    ? () => navigation.setParams({
        title,
        onPressTitle: () => navigation.navigate('ThreadParticipants', { id })
      })
    : () => {}
  return {
    ...ownProps,
    ...dispatchProps,
    ...stateProps,
    setNavParams,
    showTopic: dispatchProps.showTopic(communityId, networkId)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
