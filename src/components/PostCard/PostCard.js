/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostImage from './PostImage'
import PostFooter from './PostFooter'
import samplePost from './samplePost'
import { get } from 'lodash/fp'
import { capeCod10 } from '../../style/colors'
import { shape, any, object, string, func, array, bool } from 'prop-types'

export default class PostCard extends React.Component {
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
    fetchPost: func,
    expanded: bool,
    showDetails: func,
    editPost: func,
    showCommunity: bool,
    showMember: func,
    showTopic: func
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const {
      post,
      showCommunity,
      editPost,
      currentUser,
      showMember,
      showTopic,
      goToCommunity
    } = this.props

    const slug = get('0.slug', post.communities)
    return <View style={styles.container}>
      <PostHeader creator={post.creator}
        date={post.createdAt}
        type={post.type}
        showCommunity={showCommunity}
        editPost={editPost}
        topics={post.topics}
        communities={post.communities}
        slug={slug}
        pinned={post.pinned}
        postId={post.id}
        showMember={showMember}
        showTopic={showTopic}
        goToCommunity={goToCommunity} />
      <PostImage postId={post.id} />
      <PostBody
        title={post.title}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic}
        shouldTruncate />
      <PostFooter id={post.id}
        currentUser={currentUser}
        commenters={post.commenters}
        commentsTotal={post.commentsTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
    </View>
  }
}

const styles = {
  container: {
    borderWidth: 1,
    borderColor: capeCod10,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  imageMargin: {
    marginBottom: 12
  }
}
