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
    const { showCommunity } = this.props
    const {
      id: postId,
      communities,
      type,
      updatedAt,
      createdAt,
      creator,
      details,
      title,
      linkPreview,
      commenters,
      commentsTotal,
      votesTotal,
      myVote,
      editPost,
      currentUser,
      showMember,
      showTopic,
      goToCommunity
    } = this.props.post

    const slug = get('0.slug', communities)
    return <View style={styles.container}>
      <PostHeader creator={creator}
        date={updatedAt || createdAt}
        type={type}
        showCommunity={showCommunity}
        editPost={editPost}
        communities={communities}
        slug={slug}
        postId={postId}
        showMember={showMember}
        goToCommunity={goToCommunity} />
      <PostImage postId={postId} />
      <PostBody
        title={title}
        details={details}
        linkPreview={linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic}
        shouldTruncate />
      <PostFooter id={postId}
        currentUser={currentUser}
        commenters={commenters}
        commentsTotal={commentsTotal}
        votesTotal={votesTotal}
        myVote={myVote} />
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
