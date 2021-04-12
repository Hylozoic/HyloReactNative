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

export default class PostDetails extends React.Component {
  state = {
    commentText: '',
    commentPrompt: null
  }
  scrollViewRef = React.createRef()
  editorRef = React.createRef()

  componentDidMount () {
    this.props.fetchPost()
    this.props.navigation.setOptions({
      headerTitle: this.props.currentGroup?.name
    })
  }

  shouldComponentUpdate (nextProps) {
    return !!nextProps.isFocused
  }

  onShowTopic = (topicId) => this.props.showTopic(topicId, get('post.groups.0.id', this.props))

  handleCreateComment = (commentText) => {
    const commentTextAsHtml = toHtml(commentText)

    if (!isEmpty(commentTextAsHtml)) {
      this.setState(() => ({ submitting: true }))
      return this.props.createComment(commentTextAsHtml)
        .then(({ error }) => {
          if (error) {
            Alert.alert("Your comment couldn't be saved; please try again.")
            this.setState(() => ({ submitting: false }))
          } else {
            this.setState(() => ({ commentText: '', submitting: false }))
          }
        })
    }
  }

  handleCommentOnChange = (commentText) => {
    this.setState(() => ({ commentText }))
  }

  setCommentPrompt = comment => {
    this.setState({ commentPrompt: `Replying to ${comment.creator.name}` })    
  }

  onCommentReplyCancel = () => {
    this.setState({ commentPrompt: null })    
    // unhighlight/deselect current entry we're commenting to in flatlist      
    this.editorRef.current?.editorInputRef.current.clear()
    this.editorRef.current?.editorInputRef.current.blur()
  }

  onCommentReply = comment => {
    // For recursive sub-comment context, will reply to the parent's comment 
    const currentScrollView = this.scrollViewRef.current
    if (currentScrollView) {
      this.setCommentPrompt(comment)
      const commentIdScrollTarget = comment.parentComment || comment.id
      currentScrollView.scrollToIndex({
        index: currentScrollView.props.data.findIndex(c => c.id == commentIdScrollTarget)
      })
      // highlight/select current entry we're commenting to in flatlist      
      this.editorRef.current?.editorInputRef.current.clear()
      // editorRef?.current?.insertMention(post.creator)
      this.editorRef.current?.editorInputRef.current.focus()
    }
  }

  renderPostDetails = (panHandlers) => {
    const { post, currentUser, showMember } = this.props
    const slug = get('groups.0.slug', post)
    const isMember = find(member => member.id === currentUser.id, post.members)
    const location = post.location || (post.locationObject && post.locationObject.fullText)

    return (
      <Comments style={styles.commentsScrollView}
        postId={post.id}
        scrollViewRef={this.scrollViewRef}
        onReply={this.onCommentReply}
        header={(
          <PostCardForDetails
            {...this.props}
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
    const { commentText, commentPrompt, submitting } = this.state
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
            {commentPrompt && (
              <View style={styles.commentPrompt}>
                <Text style={styles.commentPromptText}>{commentPrompt}</Text>
                <TouchableOpacity onPress={this.onCommentReplyCancel}>
                  <Text style={styles.commentPromptClearLink}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            <InlineEditor
              style={styles.inlineEditor}
              ref={this.editorRef}
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

export function PostCardForDetails ({
  post,
  currentUser,
  editPost,
  isProject,
  joinProject,
  leaveProject,
  showMember,
  showTopic,
  goToMembers,
  goToGroup
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
        type={post.type}
        title={post.title}
        details={post.details}
        startTime={post.startTime}
        endTime={post.endTime}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic}
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
          style={styles.joinButton}
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
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
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
