import React, { Component } from 'react'
import { ListView, Text, View } from 'react-native'
import fetchGraphQL from '../util/fetchGraphQL'

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
    fetchGraphQL('{ me { posts(first: 100) { id title } } }')
    .then(data => {
      this.setState({
        posts: this.dataSource.cloneWithRows(data.me.posts)
      })
    })
  }

  render () {
    return <ListView
      style={{marginTop: 20}}
      dataSource={this.state.posts}
      renderRow={post => <Post post={post} />}
      enableEmptySections />
  }
}

const Post = ({ post }) => {
  return <View style={{margin: 10, marginBottom: 0}}>
    <Text>{post.title}</Text>
  </View>
}
