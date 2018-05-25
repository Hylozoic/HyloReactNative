/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostImage from './PostImage'
import PostFooter from './PostFooter'
import PostCommunities from './PostCommunities'
import samplePost from './samplePost'
import { get } from 'lodash/fp'
import { capeCod10 } from '../../style/colors'
import { shape, any, object, string, func, array, bool } from 'prop-types'

export default class PostCard extends React.PureComponent {
  static propTypes = {
    post: shape({
      id: any,
      type: string,
      imageUrl: string,
      name: string,
      details: string,
      upVotes: string,
      updatedAt: string,
      linkPreview: object
    }),
    creator: object,
    isPinned: bool,
    commenters: array,
    communities: array,
    imageUrls: array,
    topics: array,
    fetchPost: func,
    expanded: bool,
    showDetails: func,
    showMember: func,
    showTopic: func
  }

  static defaultProps = {
    post: samplePost()
  }

  render () {
    const {
      post,
      creator,
      commenters,
      communities,
      imageUrls,
      isPinned,
      topics,
      showMember,
      showTopic,
      goToCommunity,
      selectedNetworkId
    } = this.props

    const slug = get('0.slug', communities)
    return <View style={styles.container}>
      <PostHeader creator={creator}
        date={post.createdAt}
        type={post.type}
        topics={topics}
        slug={slug}
        pinned={isPinned}
        postId={post.id}
        showMember={showMember}
        showTopic={showTopic}
        announcement={post.announcement}
      />
      <PostImage imageUrls={imageUrls} />
      <PostBody
        title={post.title}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        showMember={showMember}
        showTopic={showTopic}
        shouldTruncate />
      <PostCommunities
        communities={communities}
        slug={slug}
        selectedNetworkId={selectedNetworkId}
        goToCommunity={goToCommunity} />
      <PostFooter id={post.id}
        commenters={commenters}
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
