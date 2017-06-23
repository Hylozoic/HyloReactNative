import React, { Component } from 'react'
import { ListView, TouchableOpacity, View } from 'react-native'
import fetchGraphQL from '../util/fetchGraphQL'
import mixins from '../style/mixins'
import Post from './Post'
import PostCard from './PostCard'
import samplePost from './PostCard/samplePost'

export default class MyPosts extends Component {
  constructor (props) {
    super(props)
    console.log(this.props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.title !== r2.title
    })
    this.state = {
      posts: this.dataSource.cloneWithRows([])
    }
  }

  componentDidMount () {
    fetchGraphQL('{ me { posts(first: 100, order: "desc") { id title } } }')
    .then(data => {
      const posts = data.me.posts.map(p => {
        return Object.assign({}, samplePost(), p)
      })
      this.setState({
        posts: this.dataSource.cloneWithRows(posts)
      })
    })
  }

  render () {
    return <ListView
      title='My Posts'
      style={styles.container}
      dataSource={this.state.posts}
      renderRow={post =>
        <PostRow post={post} navigation={this.props.navigation} />}
      enableEmptySections />
  }
}

function PostRow ({ post, navigation }) {
  const showPost = () =>
    navigation.navigate('Post2', { post: {post} })

  return <View style={styles.postRow}>
    <TouchableOpacity onPress={showPost}>
      <PostCard post={post} />
    </TouchableOpacity>
  </View>
}
PostRow.contextTypes = {navigate: React.PropTypes.func}

const styles = {
  container: {
    padding: 10,
    ...mixins.belowNavigationBar,
    backgroundColor: 'white'
  },
  postRow: {
    paddingBottom: 15
  }
}
