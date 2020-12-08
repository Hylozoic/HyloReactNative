/* eslint-disable camelcase */
import React from 'react'
import { Linking, View, Text, TouchableOpacity, Alert } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { get, isEmpty, find } from 'lodash/fp'
import { shape, any, object, string, func, array, bool } from 'prop-types'
import Comments from '../Comments'
import PostBody from '../PostCard/PostBody'
import PostCommunities from '../PostCard/PostCommunities'
import PostImage from '../PostCard/PostImage'
import PostFooter from '../PostCard/PostFooter'
import PostHeader from '../PostCard/PostHeader'
import ProjectMembersSummary from '../ProjectMembersSummary'
import { LoadingScreen } from '../Loading'
import Button from '../Button'
import SocketSubscriber from '../SocketSubscriber'
import { FileLabel } from '../PostEditor/FileSelector'
import Icon from '../Icon'
import InlineEditor, { toHtml } from '../InlineEditor'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import styles from './PostDetails.styles'

export default class PostDetails extends React.Component {
  static propTypes = {
    post: shape({
      id: any,
      type: string,
      creator: object,
      imageUrl: string,
      name: string,
      details: string,
      commenters: array,
      upVotes: string,
      updatedAt: string
    }),
    currentUser: shape({
      id: any,
      name: string,
      avatarUrl: string
    }),
    editPost: func,
    pending: bool,
    showMember: func,
    showTopic: func
  }

  state = {
    commentText: ''
  }

  componentDidMount () {
    this.props.fetchPost()
  }

  shouldComponentUpdate (nextProps) {
    return !!nextProps.isFocused
  }

  handleShowTopic = (topicId) => this.props.showTopic(topicId, get('post.communities.0.id', this.props))

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
            // Scrolls to the last comment (the one that was created)
            this.refs.comments.getWrappedInstance().scrollToEnd()
          }
        })
    }
  }

  handleCommentOnChange = (commentText) => {
    this.setState(() => ({ commentText }))
  }

  render () {
    const {
      post,
      currentUser,
      editPost,
      pending,
      isProject,
      joinProject,
      leaveProject,
      showMember,
      goToMembers,
      goToCommunity
    } = this.props

    const {
      commentText,
      submitting
    } = this.state

    if (!post || !post.creator || !post.title) return <LoadingScreen />

    const slug = get('communities.0.slug', post)
    const communityId = get('communities.0.id', post)
    const isMember = find(member => member.id === currentUser.id, post.members)
    const location = post.location || (post.locationObject && post.locationObject.fullText)

    const postCard = <View style={styles.postCard}>
      <PostHeader
        creator={post.creator}
        date={post.createdAt}
        type={post.type}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        pinned={post.pinned}
        topics={post.topics}
        showTopic={this.handleShowTopic}
        postId={post.id}
        showMember={showMember}
        goToCommunity={goToCommunity}
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
        showTopic={this.handleShowTopic} />
      {!isEmpty(post.fileUrls) && <Files urls={post.fileUrls} />}
      {isProject &&
        <ProjectMembersSummary
          members={post.members}
          onPress={goToMembers}
          dimension={34}
          style={styles.projectMembersContainer} />}
      {isProject && <JoinProjectButton
        style={styles.joinButton}
        leaving={isMember}
        onPress={isMember ? leaveProject : joinProject}
      />}
      {!!location && <View style={styles.infoRow}>
        <Icon style={styles.locationIcon} name='Location' />
        <Text style={styles.infoRowInfo} selectable>{location}</Text>
      </View>}
      <PostCommunities
        communities={post.communities}
        includePublic={post.isPublic}
        slug={slug}
        style={[styles.infoRow]}
        goToCommunity={goToCommunity}
        shouldShowCommunities />
      <PostFooter
        style={styles.postFooter}
        id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        showActivityLabel />
    </View>

    return <SafeAreaView style={{flex: 1}}>
      <KeyboardFriendlyView style={styles.container}>
        <Comments
          ref='comments'
          header={postCard}
          footer={<CommentPrompt
            currentUser={currentUser}
            communityId={communityId}
            submitting={submitting}
            onChange={this.handleCommentOnChange}
            onSubmit={this.handleCreateComment}
            commentText={commentText} />
          }
          postId={post.id}
          postPending={pending}
          showMember={showMember}
          showTopic={this.handleShowTopic}
          slug={slug} />
        <SocketSubscriber type='post' id={post.id} />
      </KeyboardFriendlyView>
    </SafeAreaView>
  }
}

export function CommentPrompt ({ currentUser, onChange, onSubmit, submitting, commentText, communityId }) {
  if (!currentUser) return null

  return <InlineEditor
    onChange={onChange}
    onSubmit={onSubmit}
    value={commentText}
    style={styles.inlineEditor}
    submitting={submitting}
    placeholder={'Write a comment...'}
    communityId={communityId}
  />
}

export function Files ({ urls }) {
  return <View style={styles.files}>
    {urls.map(url =>
      <TouchableOpacity key={url} onPress={openUrlFn(url)}>
        <FileLabel url={url} />
      </TouchableOpacity>
    )}
  </View>
}

const openUrlFn = url => () =>
  Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url))

export function JoinProjectButton ({ style, onPress, leaving }) {
  const text = leaving ? 'Leave Project' : 'Join Project'
  return <Button
    style={style}
    text={text}
    onPress={onPress} />
}
