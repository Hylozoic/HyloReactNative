/* eslint-disable camelcase */
import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAccessoryView } from '@flyerhq/react-native-keyboard-accessory-view'
import { get, isEmpty, find } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { isModalScreen } from 'navigation/linking/helpers'
import SocketSubscriber from 'components/SocketSubscriber'
import Comments from 'components/Comments'
import PostBody from 'components/PostCard/PostBody'
import PostGroups from 'components/PostCard/PostGroups'
import PostImage from 'components/PostCard/PostImage'
import Files from 'components/Files'
import PostFooter from 'components/PostCard/PostFooter'
import PostHeader from 'components/PostCard/PostHeader'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import Button from 'components/Button'
import InlineEditor, { toHTML } from 'components/InlineEditor'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import styles from './PostDetails.styles'

export class PostDetails extends React.Component {
  state = {
    replyingToComment: null,
    commentText: '',
    submitting: false
  }

  commentsRef = React.createRef()
  editorRef = React.createRef()

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

  handleCreateComment = async commentText => {
    const commentHTML = toHTML(commentText)

    if (!isEmpty(commentHTML)) {
      const { replyingToComment } = this.state
      const parentCommentId = replyingToComment?.parentComment || replyingToComment?.id || null

      this.setState(() => ({ submitting: true }))

      const { error } = await this.props.createComment({
        text: commentHTML,
        parentCommentId
      })

      this.setState(() => ({ submitting: false }))

      if (error) {
        Alert.alert("Your comment couldn't be saved; please try again.")
      } else {
        this.handleCommentReplyCancel()
      }
    }
  }

  handleCommentOnChange = (commentText) => {
    this.setState(() => ({ commentText }))
  }

  handleCommentReplyCancel = callback => {
    this.setState({ replyingToComment: null, commentText: '' }, () => {
      this.commentsRef?.current.highlightComment(null)
      this.editorRef?.editorInputRef?.current.clear()
      this.editorRef?.editorInputRef?.current.blur()
      callback && callback()
    })
  }

  handleCommentReply = (comment, { mention = false }) => {
    this.handleCommentReplyCancel(() => {
      this.setState({ replyingToComment: comment, commentText: '' })

      this.commentsRef?.current.highlightComment(comment)
      this.commentsRef?.current.scrollToComment(comment)
      this.editorRef?.editorInputRef?.current.clear()
      this.editorRef?.editorInputRef?.current.focus()
    })
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
        onReply={this.handleCommentReply}
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
        slug={firstGroupSlug}
        showMember={showMember}
        panHandlers={panHandlers}
      />
    )
  }

  render () {
    const { post, tabBarHeight, isModal } = this.props
    const { commentText, replyingToComment, submitting } = this.state
    const replyingToPerson = replyingToComment?.parentComment && replyingToComment.creator
    const groupId = get('groups.0.id', post)

    if (!post?.creator || !post?.title) return <Loading />

    return (
      <View style={styles.container}>
        <KeyboardAccessoryView
          contentContainerStyle={{
            ...styles.promptContentContainer,
            paddingBottom: isModal ? this.props.safeAreaInsets.bottom : 0
          }}
          spaceBetweenKeyboardAndAccessoryView={isIOS ? -tabBarHeight : 0}
          contentOffsetKeyboardOpened={isIOS ? -tabBarHeight : 0}
          renderScrollable={this.renderPostDetails}
        >
          {replyingToPerson?.name && (
            <View style={styles.commentPrompt}>
              <Text style={styles.commentPromptText}>
                Replying to <Text style={{ fontWeight: 'bold' }}>{replyingToPerson.name}</Text> {'\u00B7'}
              </Text>
              <TouchableOpacity onPress={() => this.handleCommentReplyCancel()}>
                <Text style={styles.commentPromptClearLink}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          <InlineEditor
            style={styles.inlineEditor}
            onRef={elem => (this.editorRef = elem)}
            onChange={this.handleCommentOnChange}
            onSubmit={this.handleCreateComment}
            placeholder='Write a comment...'
            value={commentText}
            initialMentionPerson={replyingToPerson}
            submitting={submitting}
            groupId={groupId}
          />
        </KeyboardAccessoryView>
        <SocketSubscriber type='post' id={post.id} />
      </View>
    )
  }
}

export default function (props) {
  const isModal = isModalScreen(props.route?.name)
  const isFocused = useIsFocused()

  const safeAreaInsets = useSafeAreaInsets()
  const tabBarHeight = isModal ? 0 : useBottomTabBarHeight()

  return (
    <PostDetails
      {...props}
      isModal={isModal}
      isFocused={isFocused}
      safeAreaInsets={safeAreaInsets}
      tabBarHeight={tabBarHeight}
    />
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
