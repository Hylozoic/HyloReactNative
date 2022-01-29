/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import PostHeader from './PostHeader'
import PostBody from './PostBody'
import PostImage from './PostImage'
import PostFooter from './PostFooter'
import PostGroups from './PostGroups'
import { get } from 'lodash/fp'
import { capeCod10 } from 'style/colors'
import Files from 'components/Files'
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
    post: {},
    showGroups: true
  }

  render () {
    const {
      commenters,
      creator,
      goToGroup,
      groups,
      hideDetails,
      hideMenu,
      imageUrls,
      fileUrls,
      isPinned,
      post,
      respondToEvent,
      showGroups,
      showMember,
      showTopic,
      topics
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
          details={post.details}
          endTime={post.endTime}
          hideDetails={hideDetails}
          linkPreview={post.linkPreview}
          myEventResponse={post.myEventResponse}
          respondToEvent={respondToEvent}
          shouldTruncate
          showMember={showMember}
          showTopic={showTopic}
          slug={slug}
          startTime={post.startTime}
          title={post.title}
          type={post.type}
        />
        <Files urls={fileUrls} />
        {showGroups && (
          <PostGroups
            style={styles.groups}
            groups={groups}
            includePublic={post.isPublic}
            slug={slug}
            goToGroup={goToGroup}
          />
        )}
        <PostFooter
          id={post.id}
          commenters={commenters}
          commentersTotal={post.commentersTotal}
          members={post.members}
          eventInvitations={post.eventInvitations}
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
