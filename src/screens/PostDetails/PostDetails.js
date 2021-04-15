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
    commentPrompt: null,
    parentCommentId: null
  }
  commentsRef = React.createRef()
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

  handleCreateComment = async commentText => {
    const commentTextAsHtml = toHtml(commentText)

    if (!isEmpty(commentTextAsHtml)) {
      this.setState(() => ({ submitting: true }))

      const { error } = await this.props.createComment({
        text: commentTextAsHtml,
        parentCommentId: this.state.parentCommentId
      })

      if (error) {
        Alert.alert("Your comment couldn't be saved; please try again.")
        this.setState(() => ({ submitting: false }))
      } else {
        this.setState(() => ({ commentText: '', submitting: false }))
      }
    }
  }

  handleCommentOnChange = (commentText) => {
    this.setState(() => ({ commentText }))
  }

  handleCommentReplyCancel = () => {
    this.setState({ commentPrompt: null, commentText: '' })
    // unhighlight/deselect current entry we're commenting to in flatlist
    this.editorRef?.editorInputRef.current.clear()
    this.editorRef?.editorInputRef.current.blur()
  }

  handleCommentReply = (comment, { mention = false }) => {
    // For recursive sub-comment context, will reply to the parent's comment 
    // console.log('!!!!!! this.commentsRef?.current', this.commentsRef?.current.subListRefs.current[comment.parentComment].mainListRef.scrollToIndex(2))
    // console.log('!!! this.commentsRef?.current.subListRefs.current[comment.parentComment].mainListRef.current', this.commentsRef?.current.subListRefs.current[comment.parentComment].mainListRef.current.scrollToIndex)
    // this.commentsRef?.current.subListRefs?.current[comment.parentComment].mainListRef.current.scrollToEnd()
    const currentScrollView = this.commentsRef?.current

    if (currentScrollView) {
      this.setState({ commentPrompt: `Replying to ${comment.creator.name}`, commentText: '' })
      const parentCommentId = comment.parentComment || comment.id
      const subCommentId = comment.parentComment ? comment.id : null

      this.setState({ parentCommentId })
      // TODO: This will currently scroll to the parent entry, which means to the bottom
      //       of all it's child comments.
      //       We likely will want the scroll to happen within the subcomment list
      //       if commenting 
      const section = currentScrollView.props.sections.find(section => parentCommentId == section.comment.id)
      const sectionIndex = section.comment.sectionIndex
      const itemIndex = section.data.find(subComment => subCommentId == subComment.id)?.itemIndex || 0
      console.log('!!!! parentCommentId, sectionIndex, itemIndex:', comment, sectionIndex, itemIndex)

      currentScrollView.scrollToLocation({
        sectionIndex,
        itemIndex
        // viewPosition: 0
      })
      // TODO: highlight/select current entry we're commenting to in flatlist      
      this.editorRef?.editorInputRef.current.clear()
      if (mention) this.editorRef?.insertMention(comment.creator)
      this.editorRef?.editorInputRef.current.focus()
    }
  }

  renderPostDetails = (panHandlers) => {
    const { post, currentUser, showMember } = this.props
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
                <TouchableOpacity onPress={this.handleCommentReplyCancel}>
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
