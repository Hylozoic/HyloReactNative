/* eslint-disable camelcase */
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './PostRow.styles'
import PostCard from 'components/PostCard'

export default class PostRow extends React.PureComponent {
  showPost = () => this.props.showPost(this.props.post.id)

  render () {
    const {
      post, commenters, groups, creator, topics, imageUrls, isPinned,
      showMember, showTopic, goToGroup, shouldShowGroups, respondToEvent
    } = this.props

    if (!post) return null

    return (
      <View style={styles.postRow}>
        <TouchableOpacity delayPressIn={50} activeOpacity={0.6} onPress={this.showPost}>
          <View>
            <PostCard
              post={post}
              commenters={commenters}
              groups={groups}
              topics={topics}
              creator={creator}
              imageUrls={imageUrls}
              isPinned={isPinned}
              showMember={showMember}
              respondToEvent={response => respondToEvent(post.id ,response)}
              showTopic={showTopic}
              goToGroup={goToGroup}
              shouldShowGroups={shouldShowGroups}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
