import React from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../../style/mixins'
import PostEditor from '../PostEditor'
import PropTypes from 'prop-types'

function Post ({ post }, { navigate }) {
  const edit = () => navigate({
    title: 'Edit Post',
    component: PostEditor,
    props: {post}
  })

  return <View style={styles.post}>
    <Text>The title of this post is "{post.title}"</Text>
    <Text style={styles.lips}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce aliquam
      lorem in condimentum ultricies. Nunc et purus mollis magna scelerisque
      placerat. Mauris vel convallis massa, id efficitur ex. Duis eget blandit
      lorem. Aliquam bibendum velit erat, non viverra leo congue id. Maecenas at
      elit risus. Aenean elit arcu, varius id porta et, laoreet eu nulla. Donec
      in ante scelerisque, condimentum nisi a, luctus nisi. Fusce finibus auctor
      metus vel vulputate. Etiam eget turpis auctor, fringilla velit vel, mollis
      arcu. Nulla at nisl eget nulla bibendum vehicula.
    </Text>
    <Button title='Edit this post' onPress={edit} />
  </View>
}
Post.contextTypes = {navigate: PropTypes.func}

export default Post

const styles = {
  post: {
    padding: 10,
    backgroundColor: '#fff',
    ...mixins.belowNavigationBar,
    flex: 1
  },
  lips: {
    marginTop: 10,
    fontSize: 10
  }
}
