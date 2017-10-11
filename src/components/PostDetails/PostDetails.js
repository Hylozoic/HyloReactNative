/* eslint-disable camelcase */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { get } from 'lodash/fp'
import { shape, any, object, string, func, array, bool } from 'prop-types'
import striptags from 'striptags'

import Avatar from '../Avatar'
import Comments from '../Comments'
import PostBody from '../PostCard/PostBody'
import PostFooter from '../PostCard/PostFooter'
import PostHeader from '../PostCard/PostHeader'
import Loading from '../Loading'
import SocketSubscriber from '../SocketSubscriber'
import SpaceFillingImage from '../SpaceFillingImage'

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

  componentDidMount () {
    this.props.fetchPost()
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

    if (!post || pending) return <Loading />

    const slug = get('0.slug', post.communities)

    const { location } = post

    const postCard = <View style={styles.postCard}>
      <PostHeader creator={post.creator}
        date={post.updatedAt || post.createdAt}
        type={post.type}
        editPost={editPost}
        communities={post.communities}
        slug={slug}
        id={post.id}
        showMember={showMember}
        goToCommunity={goToCommunity} />
      <View style={post.imageUrl ? styles.imageMargin : {}}>
        <SpaceFillingImage imageUrl={post.imageUrl} />
      </View>
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
