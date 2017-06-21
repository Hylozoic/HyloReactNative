import React, { Component } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from './FeedList.styles'
import PostCard from '../PostCard'
import Post from '../Post'

export default class FeedList extends Component {
  render () {
    const { posts, loadMorePosts } = this.props
    return <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={posts}
        renderItem={({ item }) => <PostRow post={item} />}
        keyExtractor={(item, index) => item.id}
        onEndReached={loadMorePosts}
        />
    </View>
  }
}

export function PostRow ({ post }, { navigate }) {
  const showPost = () =>
    navigate({title: 'Post', component: Post, props: {post}})

  return <View style={styles.postRow}>
    <TouchableOpacity onPress={showPost}>
      <PostCard post={post} />
    </TouchableOpacity>
  </View>
}
PostRow.contextTypes = {navigate: React.PropTypes.func}
