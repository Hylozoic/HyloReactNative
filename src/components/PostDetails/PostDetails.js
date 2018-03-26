/* eslint-disable camelcase */
import React from 'react'
import { Linking, View, Text, TouchableOpacity } from 'react-native'
import { get, isEmpty } from 'lodash/fp'
import { shape, any, object, string, func, array, bool } from 'prop-types'
import striptags from 'striptags'
import Avatar from '../Avatar'
import Comments from '../Comments'
import PostBody from '../PostCard/PostBody'
import PostImage from '../PostCard/PostImage'
import PostFooter from '../PostCard/PostFooter'
import PostHeader from '../PostCard/PostHeader'
import { LoadingScreen } from '../Loading'
import SocketSubscriber from '../SocketSubscriber'
import styles from './PostDetails.styles'
import { FileLabel } from '../PostEditor/FileSelector'

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

  componentDidMount () {
    this.props.fetchPost()
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const {
      post,
      currentUser,
      editPost,
      pending,
      showMember,
      showTopic,
      newComment,
      commentEdit,
      goToCommunity
    } = this.props

    if (!post || !post.title) return <LoadingScreen />

    const slug = get('0.slug', post.communities)

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
        showTopic={showTopic}
        postId={post.id}
        showMember={showMember}
        goToCommunity={goToCommunity} />
      <PostImage postId={post.id} linked />
      <PostBody title={post.title}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic} />
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
        footer={<CommentPrompt {...{currentUser, newComment, commentEdit}} />}
        postId={post.id}
        postPending={pending}
        showMember={showMember}
        showTopic={showTopic}
        slug={slug} />
      <SocketSubscriber type='post' id={post.id} />
    </View>
  }
}

export function CommentPrompt ({ currentUser, newComment, commentEdit }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser

  const commentExcerpt = commentEdit && striptags(commentEdit, [], ' ').substring(0, 35)

  const promptText = commentExcerpt || `${currentUser.firstName()}, how can you help?`
  const promptTextStyle = [
    styles.promptText,
    commentEdit ? null : styles.placeholder
  ]

  return <View style={styles.commentPrompt}>
    <TouchableOpacity onPress={newComment} style={styles.promptButton}>
      <Avatar avatarUrl={avatarUrl} style={styles.avatar} />
      <Text style={promptTextStyle}>{promptText}</Text>
    </TouchableOpacity>
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
