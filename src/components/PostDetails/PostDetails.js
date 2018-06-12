/* eslint-disable camelcase */
import React from 'react'
import { Linking, View, Text, TouchableOpacity } from 'react-native'
import { get, isEmpty, trim } from 'lodash/fp'
import { shape, any, object, string, func, array, bool } from 'prop-types'
import { htmlEncode } from 'js-htmlencode'
import Comments from '../Comments'
import PostBody from '../PostCard/PostBody'
import PostCommunities from '../PostCard/PostCommunities'
import PostImage from '../PostCard/PostImage'
import PostFooter from '../PostCard/PostFooter'
import PostHeader from '../PostCard/PostHeader'
import { LoadingScreen } from '../Loading'
import SocketSubscriber from '../SocketSubscriber'
import styles from './PostDetails.styles'
import { FileLabel } from '../PostEditor/FileSelector'
import InlineEditor from '../InlineEditor'

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
    return nextProps.isFocused
  }

  handleShowMember = (memberId) => this.props.showMember(memberId)
  handleShowTopic = (topicId) => this.props.showTopic(topicId)
  handleGoToCommunity = (communityId) => this.props.goToCommunity(communityId)

  handleCreateComment = (commentText) => {
    const encodedCommentText = htmlEncode(trim(commentText))

    if (!isEmpty(encodedCommentText)) {
      this.props.createComment(encodedCommentText)
    }

    this.setState({commentText: ''})
  }

  handleCommentOnChange = (commentText) => {
    this.setState({commentText})
  }

  render () {
    const {
      post,
      currentUser,
      editPost,
      pending
    } = this.props

    const {
      commentText
    } = this.state

    if (!post || !post.creator || !post.title) return <LoadingScreen />

    const slug = get('communities.0.slug', post)
    const communityId = get('communities.0.id', post)

    const { location } = post

    const postCard = <View style={styles.postCard}>
      <PostHeader creator={post.creator}
        date={post.createdAt}
        type={post.type}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        pinned={post.pinned}
        topics={post.topics}
        showTopic={this.handleShowTopic}
        postId={post.id}
        showMember={this.handleShowMember}
        goToCommunity={this.handleGoToCommunity}
        announcement={post.announcement}
      />
      <PostImage imageUrls={post.imageUrls} linked />
      <PostBody title={post.title}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={this.handleShowMember}
        showTopic={this.handleShowTopic} />
      <PostCommunities
        communities={post.communities}
        slug={slug}
        goToCommunity={this.handleGoToCommunity} />
      {!!location && <View style={[styles.infoRow, styles.bottomInfoRow]}>
        <Text style={styles.infoRowLabel}>Location:</Text>
        <Text style={styles.infoRowinfo}>{location}</Text>
      </View>}
      {!isEmpty(post.fileUrls) && <Files urls={post.fileUrls} />}
      <PostFooter id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        showActivityLabel />
    </View>

    return <View style={styles.container}>
      <Comments
        header={postCard}
        footer={<CommentPrompt
          currentUser={currentUser}
          communityId={communityId}
          onChange={this.handleCommentOnChange}
          onSubmit={this.handleCreateComment}
          commentText={commentText} />
        }
        postId={post.id}
        postPending={pending}
        showMember={this.handleShowMember}
        showTopic={this.handleShowTopic}
        slug={slug} />
      <SocketSubscriber type='post' id={post.id} />
    </View>
  }
}

export function CommentPrompt ({ currentUser, onChange, onSubmit, commentText, communityId }) {
  if (!currentUser) return null

  return <View style={styles.commentPrompt}>
    <InlineEditor
      onChange={onChange}
      onSubmit={onSubmit}
      value={commentText}
      placeholder={`${currentUser.firstName()}, how can you help?`}
      communityId={communityId}
    />
  </View>
}

export function Files ({ urls }) {
  return <View style={styles.files}>
    {urls.map(url => <TouchableOpacity key={url} onPress={openUrlFn(url)}>
      <FileLabel url={url} />
    </TouchableOpacity>)}
  </View>
}

const openUrlFn = url => () =>
  Linking.canOpenURL(url).then(ok => ok && Linking.openURL(url))
