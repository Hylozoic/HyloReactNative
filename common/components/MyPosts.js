import React, { Component } from 'react'
import { ListView, Text, TouchableOpacity, View } from 'react-native'
import fetchGraphQL from '../util/fetchGraphQL'
import mixins from '../style/mixins'

export default class MyPosts extends Component {
  constructor (props) {
    super(props)
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
      this.setState({
        posts: this.dataSource.cloneWithRows(data.me.posts)
      })
    })
  }

  render () {
    return <ListView
      title='My Posts'
      style={styles.container}
      dataSource={this.state.posts}
      renderRow={post => <PostRow post={post} />}
      enableEmptySections />
  }
}

function PostRow ({ post }, { navigator }) {
  const showPost = () => navigator.push({title: 'Post', id: 'post', post})
  return <View style={styles.postRow}>
    <TouchableOpacity onPress={showPost}>
      <Text>{post.title}</Text>
    </TouchableOpacity>
  </View>
}
PostRow.contextTypes = {navigator: React.PropTypes.object}

const styles = {
  container: {
    padding: 10,
    ...mixins.belowNavigationBar,
    backgroundColor: '#eee'
  },
  postRow: {
    paddingBottom: 10
  }
}
