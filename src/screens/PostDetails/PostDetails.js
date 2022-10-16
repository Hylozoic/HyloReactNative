import React from 'react'
import { View, Text } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { get, find } from 'lodash/fp'
import { isModalScreen } from 'navigation/linking/helpers'
import Button from 'components/Button'
import { KeyboardAccessoryCommentEditor } from 'components/CommentEditor/CommentEditor'
import Comments from 'components/Comments'
import Files from 'components/Files'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import PostBody from 'components/PostCard/PostBody'
import PostFooter from 'components/PostCard/PostFooter'
import PostGroups from 'components/PostCard/PostGroups'
import PostHeader from 'components/PostCard/PostHeader'
import PostImage from 'components/PostCard/PostImage'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import SocketSubscriber from 'components/SocketSubscriber'
import styles from './PostDetails.styles'

export class PostDetails extends React.Component {
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
    const { post, currentUser, currentGroup, respondToEvent, showMember, isModal } = this.props
    const firstGroupSlug = get('groups.0.slug', post)
    const isMember = find(member => member.id === currentUser.id, post.members)
    const location = post.location || (post.locationObject && post.locationObject.fullText)
    const showGroups = isModal || post?.groups.find(g => g.slug !== currentGroup?.slug)

    return (
      <Comments
        style={styles.commentsScrollView}
        ref={this.commentsRef}
        postId={post.id}
        header={(
          <PostCardForDetails
            {...this.props}
            showGroups={showGroups}
            respondToEvent={respondToEvent}
            showTopic={this.onShowTopic}
            isMember={isMember}
            location={location}
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
    // ??? Follow-up: `PostDetails#replyingToComment` is also `Comments#selectedComment`
    // but `Comments#selectedComment` is not `PostDetails#replyingToComment`
    const { selectedComment } = this.state
    const { post, isModal } = this.props
    const groupId = get('groups.0.id', post)

    if (!post?.creator || !post?.title) return <Loading />

    return (
      <View style={styles.container}>
        <KeyboardAccessoryCommentEditor
          renderScrollable={this.renderPostDetails}
          isModal={isModal}
          postId={post?.id}
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

export default function (props) {
  const isModal = isModalScreen(props.route?.name)
  const isFocused = useIsFocused()

  return (
    <PostDetails {...props} isModal={isModal} isFocused={isFocused} />
  )
}

export function PostCardForDetails ({
  currentUser,
  editPost,
  goToGroup,
  goToMembers,
  isProject,
  joinProject,
  leaveProject,
  post,
  respondToEvent,
  showMember,
  showTopic,
  showGroups
}) {
  const slug = get('groups.0.slug', post)
  const isMember = find(member => member.id === currentUser.id, post.members)
  const location = post.location || (post.locationObject && post.locationObject.fullText)

  return (
    <View style={styles.postCard}>
      <PostHeader
        postId={post.id}
        creator={post.creator}
        date={post.createdAt}
        type={post.type}
        editPost={editPost}
        groups={post.groups}
        slug={slug}
        pinned={post.pinned}
        topics={post.topics}
        showTopic={showTopic}
        showMember={showMember}
        goToGroup={goToGroup}
        announcement={post.announcement}
        closeOnDelete
      />
      <PostImage imageUrls={post.imageUrls} linked />
      <PostBody
        details={post.details}
        endTime={post.endTime}
        linkPreview={post.linkPreview}
        myEventResponse={post.myEventResponse}
        respondToEvent={respondToEvent}
        slug={slug}
        startTime={post.startTime}
        title={post.title}
        type={post.type}
      />
      <Files urls={post.fileUrls} />
      {isProject && (
        <ProjectMembersSummary
          members={post.members}
          onPress={goToMembers}
          dimension={34}
          style={styles.projectMembersContainer}
        />
      )}
      {isProject && (
        <JoinProjectButton
          style={styles.projectJoinButton}
          leaving={isMember}
          onPress={isMember ? leaveProject : joinProject}
        />
      )}
      {!!location && (
        <View style={styles.infoRow}>
          <Icon style={styles.locationIcon} name='Location' />
          <Text style={styles.infoRowInfo} selectable>{location}</Text>
        </View>
      )}
      {showGroups && (
        <PostGroups
          groups={post.groups}
          includePublic={post.isPublic}
          slug={slug}
          style={[styles.infoRow]}
          goToGroup={goToGroup}
        />
      )}
      <PostFooter
        style={styles.postFooter}
        id={post.id}
        type={post.type}
        currentUser={currentUser}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        members={post.members}
        eventInvitations={post.eventInvitations}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        showActivityLabel
      />
    </View>
  )
}

export function JoinProjectButton ({ style, onPress, leaving }) {
  const text = leaving ? 'Leave Project' : 'Join Project'
  return (
    <Button
      style={style}
      text={text}
      onPress={onPress}
    />
  )
}
