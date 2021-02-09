/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostImage from './PostImage'
import PostFooter from './PostFooter'
import PostGroups from './PostGroups'
import samplePost from './samplePost'
import { get } from 'lodash/fp'
import { capeCod10 } from 'style/colors'
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
    groups: array,
    imageUrls: array,
    topics: array,
    fetchPost: func,
    expanded: bool,
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
      groups,
      imageUrls,
      isPinned,
      topics,
      showMember,
      showTopic,
      goToGroup,
      hideMenu,
      hideDetails,
      shouldShowGroups
    } = this.props
    const slug = get('0.slug', groups)

    return (
      <View style={styles.container}>
        <PostHeader
          creator={creator}
          date={post.createdAt}
          type={post.type}
          topics={topics}
          slug={slug}
          pinned={isPinned}
          postId={post.id}
          showMember={showMember}
          showTopic={showTopic}
          announcement={post.announcement}
          hideMenu={hideMenu}
        />
        <PostImage imageUrls={imageUrls} />
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
          shouldTruncate
          hideDetails={hideDetails}
        />
        <PostGroups
          style={styles.groups}
          shouldShowGroups={shouldShowGroups}
          groups={groups}
          includePublic={post.isPublic}
          slug={slug}
          goToGroup={goToGroup}
        />
        <PostFooter
          id={post.id}
          commenters={commenters}
          commentsTotal={post.commentsTotal}
          votesTotal={post.votesTotal}
          myVote={post.myVote}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    borderWidth: 1,
    borderColor: capeCod10,
    borderRadius: 4,
    backgroundColor: 'white'
  },
  groups: {
    paddingHorizontal: 12
  },
  imageMargin: {
    marginBottom: 12
  }
}
