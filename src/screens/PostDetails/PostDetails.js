/* eslint-disable camelcase */
import React from 'react'
import { Linking, View, Text, TouchableOpacity, Alert } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { KeyboardAccessoryView } from '@flyerhq/react-native-keyboard-accessory-view'
import { get, isEmpty, find } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { FileLabel } from 'screens/PostEditor/FileSelector'
import SocketSubscriber from 'components/SocketSubscriber'
import Comments from 'components/Comments'
import PostBody from 'components/PostCard/PostBody'
import PostGroups from 'components/PostCard/PostGroups'
import PostImage from 'components/PostCard/PostImage'
import PostFooter from 'components/PostCard/PostFooter'
import PostHeader from 'components/PostCard/PostHeader'
import ProjectMembersSummary from 'components/ProjectMembersSummary'
import LoadingScreen from 'screens/LoadingScreen'
import Button from 'components/Button'
import InlineEditor, { toHtml } from 'components/InlineEditor'
import Icon from 'components/Icon'
import styles from './PostDetails.styles'
import respondToEvent from 'store/actions/respondToEvent'
import useGroupSelect from 'navigation/useSelectGroup'

export class PostDetails extends React.Component {
  state = {
    replyingToName: null,
    commentText: '',
    reaplyingToCommentId: null
  }
  commentsRef = React.createRef()
  editorRef = React.createRef()

  componentDidMount () {
    this.props.fetchPost()
    this.setHeader()
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.currentGroup?.name !== this.props.currentGroup?.name) {
      this.setHeader()
    }
  }

  setHeader = () => {
    const { navigation, route, currentGroup } = this.props
    if (route.name == 'Post Details - Modal') return
    navigation.setOptions({ title: currentGroup?.name  })
  }

  shouldComponentUpdate (nextProps) {
    return !!nextProps.isFocused
  }

  onShowTopic = (topicId) =>
    this.props.showTopic(topicId, get('post.groups.0.id', this.props))

  handleCreateComment = async commentText => {
    const commentTextAsHtml = toHtml(commentText)

    if (!isEmpty(commentTextAsHtml)) {
      this.setState(() => ({ submitting: true }))

      const { error } = await this.props.createComment({
        text: commentTextAsHtml,
        parentCommentId: this.state.reaplyingToCommentId
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
    this.setState({ replyingToName: null, commentText: '' }, () => {
      this.commentsRef?.current.highlightComment(null)
      this.editorRef?.editorInputRef.current.clear()
      this.editorRef?.editorInputRef.current.blur()
      callback && callback()
    })
  }

  handleCommentReply = (comment, { mention = false }) => {
    this.handleCommentReplyCancel(() => {
      this.setState({ replyingToName: comment.creator.name, commentText: '' })
      this.setState({ reaplyingToCommentId: comment.parentComment || comment.id })
  
      this.commentsRef?.current.highlightComment(comment)
      this.commentsRef?.current.scrollToComment(comment)
      this.editorRef?.editorInputRef.current.clear()
  
      if (mention) this.editorRef?.insertMention(comment.creator)
  
      this.editorRef?.editorInputRef.current.focus()  
    })
  }

  renderPostDetails = (panHandlers) => {
    const { post, currentUser, respondToEvent, showMember } = this.props
    const slug = get('groups.0.slug', post)
    const isMember = find(member => member.id === currentUser.id, post.members)
    const location = post.location || (post.locationObject && post.locationObject.fullText)

    return (
      <Comments style={styles.commentsScrollView}
        ref={this.commentsRef}
        postId={post.id}
        onReply={this.handleCommentReply}
        header={(
          <PostCardForDetails
            {...this.props}
            respondToEvent={respondToEvent}
            showTopic={this.onShowTopic}
            isMember={isMember}
            location={location}
          />
        )}
        slug={slug}
        showMember={showMember}
        showTopic={this.onShowTopic}
        panHandlers={panHandlers}
      />
    )
  }

  render () {
    const { post } = this.props
    const { commentText, replyingToName, submitting } = this.state
    const groupId = get('groups.0.id', post)

    if (!post?.creator || !post?.title) return <LoadingScreen />

    return (
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
        <KeyboardAccessoryView
          contentContainerStyle={{ marginBottom: 0, borderWidth: 0 }}
          // TODO: Calculate these?
          spaceBetweenKeyboardAndAccessoryView={isIOS ? -79 : 0}
          contentOffsetKeyboardOpened={isIOS ? -45 : 0}
          renderScrollable={this.renderPostDetails}>
            {replyingToName && (
              <View style={styles.commentPrompt}>
                <Text style={styles.commentPromptText}>
                  Replying to <Text style={{ fontWeight: 'bold' }}>
                    {replyingToName}</Text> {'\u00B7'} </Text>
                <TouchableOpacity onPress={() => this.handleCommentReplyCancel()}>
                  <Text style={styles.commentPromptClearLink}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            <InlineEditor
              style={styles.inlineEditor}
              onRef={elem => this.editorRef = elem}
              onChange={this.handleCommentOnChange}
              onSubmit={this.handleCreateComment}
              value={commentText}
              submitting={submitting}
              placeholder='Write a comment...'
              groupId={groupId}
            />
        </KeyboardAccessoryView>
        <SocketSubscriber type='post' id={post.id} />
      </SafeAreaView>
    )
  }
}

export default function (props) {
  useGroupSelect()

  return <PostDetails {...props} />
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
  showTopic
}) {
  const slug = get('groups.0.slug', post)
  const isMember = find(member => member.id === currentUser.id, post.members)
  const location = post.location || (post.locationObject && post.locationObject.fullText)

  return (
    <View style={styles.postCard}>
      <PostHeader
        creator={post.creator}
        date={post.createdAt}
        type={post.type}
        editPost={editPost}
        groups={post.groups}
        slug={slug}
        pinned={post.pinned}
        topics={post.topics}
        showTopic={showTopic}
        postId={post.id}
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
        showMember={showMember}
        showTopic={showTopic}
        slug={slug}
        startTime={post.startTime}
        title={post.title}
        type={post.type}
      />
      {!isEmpty(post.fileUrls) && <Files urls={post.fileUrls} />}
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
      <PostGroups
        groups={post.groups}
        includePublic={post.isPublic}
        slug={slug}
        style={[styles.infoRow]}
        goToGroup={goToGroup}
        shouldShowGroups
      />
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

export function Files ({ urls }) {
  return (
    <View style={styles.files}>
      {urls.map(url =>
        <TouchableOpacity key={url} onPress={openUrlFn(url)}>
          <FileLabel url={url} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const openUrlFn = url => () =>
  Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url))

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
