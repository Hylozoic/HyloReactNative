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
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.title !== r2.title
    })
    this.state = {
      posts: this.dataSource.cloneWithRows([])
    }
  }

  componentDidMount () {
    fetchGraphQL(`{
      me {
        posts(first: 10, order: "desc") {
          id
          type
          title
          details
          communities {
            id
          }
        }
      }
    }`)
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
      renderRow={post => <PostRow post={post} />}
      enableEmptySections />
  }
}

function PostRow ({ post }, { navigate }) {
  const showPost = () =>
    navigate({title: 'Post', component: Post, props: {post}})

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
