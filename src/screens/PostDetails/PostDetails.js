import React from 'react'
import { View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { get } from 'lodash/fp'
import { isModalScreen } from 'navigation/linking/helpers'
import { KeyboardAccessoryCommentEditor } from 'components/CommentEditor/CommentEditor'
import Comments from 'components/Comments'
import Loading from 'components/Loading'
import PostCardForDetails from 'components/PostCard/PostCardForDetails'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './PostDetails.styles'

export class PostDetailsClassComponent extends React.Component {
  state = {
    selectedComment: null
  }

  commentsRef = React.createRef()

  componentDidMount () {
    this.props.fetchPost()
    this.setHeader()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentGroup?.slug !== this.props.currentGroup?.slug) {
      this.setHeader()
    }
  }

  setHeader = () => {
    const { navigation, currentGroup, isModal } = this.props

    if (isModal) return

    navigation.setOptions({ title: currentGroup?.name })
  }

  shouldComponentUpdate (nextProps) {
    return !!nextProps.isFocused
  }

  onShowTopic = (topicId) =>
    this.props.showTopic(topicId, get('post.groups.0.id', this.props))

  handleSetSelectedComment = selectedComment => this.setState({ selectedComment })

  clearSelectedComment = () => {
    this.setState({ selectedComment: null })
    this.commentsRef.current && this.commentsRef.current.clearHighlightedComment()
  }

  scrollToSelectedComment = () => {
    this.commentsRef.current && this.commentsRef.current.scrollToComment(this.state.selectedComment)
  }

  renderPostDetails = (panHandlers) => {
    const { post, currentGroup, respondToEvent, showMember, isModal } = this.props
    const firstGroupSlug = get('groups.0.slug', post)
    const showGroups = isModal || post?.groups.find(g => g.slug !== currentGroup?.slug)

    return (
      <Comments
        ref={this.commentsRef}
        postId={post.id}
        header={(
          <PostCardForDetails
            {...this.props}
            showGroups={showGroups}
            respondToEvent={respondToEvent}
            showTopic={this.onShowTopic}
          />
        )}
        onSelect={this.handleSetSelectedComment}
        slug={firstGroupSlug}
        showMember={showMember}
        panHandlers={panHandlers}
      />
    )
  }

  render () {
    const { selectedComment } = this.state
    const { post, isModal } = this.props
    const groupId = get('groups.0.id', post)

    if (!post?.creator || !post?.title) return <Loading />

    return (
      <View style={styles.container}>
        <KeyboardAccessoryCommentEditor
          renderScrollable={this.renderPostDetails}
          isModal={isModal}
          postId={post.id}
          groupId={groupId}
          replyingTo={selectedComment}
          scrollToReplyingTo={this.scrollToSelectedComment}
          clearReplyingTo={this.clearSelectedComment}
        />
        <SocketSubscriber type='post' id={post.id} />
      </View>
    )
  }
}

export default function PostDetails (props) {
  const isModal = isModalScreen(props.route?.name)
  const isFocused = useIsFocused()

  return (
    <PostDetailsClassComponent {...props} isModal={isModal} isFocused={isFocused} />
  )
}
