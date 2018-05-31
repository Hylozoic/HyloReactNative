/* eslint-disable camelcase */
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './PostRow.styles'
import PostCard from '../../PostCard'

export default class PostRow extends React.PureComponent {
  showPost = () => this.props.showPost(this.props.post.id)

  render () {
    const {
      post, commenters, communities, creator, topics, imageUrls, isPinned,
      showMember, showTopic, goToCommunity, selectedNetworkId
    } = this.props

    if (!post) return null

    return <View style={styles.postRow}>
      <TouchableOpacity delayPressIn={50} activeOpacity={0.6} onPress={this.showPost}>
        <View>
          <PostCard post={post}
            commenters={commenters}
            communities={communities}
            topics={topics}
            creator={creator}
            imageUrls={imageUrls}
            isPinned={isPinned}
            selectedNetworkId={selectedNetworkId}
            showMember={showMember}
            showTopic={showTopic}
            goToCommunity={goToCommunity} />
        </View>
      </TouchableOpacity>
    </View>
  }
}
