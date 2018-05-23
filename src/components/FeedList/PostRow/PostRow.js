/* eslint-disable camelcase */
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import styles from './PostRow.styles'
import PostCard from '../../PostCard'

export default class PostRow extends React.PureComponent {
  showPost = () => this.props.showPost(this.props.post.id)

  render () {
    const {
      post, showMember, showTopic,
      showCommunity, goToCommunity, selectedNetworkId
    } = this.props

    console.log('POST', post)
    if (!post) return null

    return <View style={styles.postRow}>
      <TouchableOpacity delayPressIn={50} activeOpacity={0.6} onPress={this.showPost}>
        <View>
          <PostCard post={post}
            showMember={showMember}
            selectedNetworkId={selectedNetworkId}
            showTopic={showTopic}
            showCommunity={showCommunity}
            goToCommunity={goToCommunity} />
        </View>
      </TouchableOpacity>
    </View>
  }
}
