import React from 'react'
import { Button, Text, View } from 'react-native'
import mixins from '../../style/mixins'
import PostEditor from '../PostEditor'
import PropTypes from 'prop-types'

function Post ({ post }, { navigate, goBack }) {
  const edit = () => navigate({
    title: 'Edit Post',
    component: PostEditor,
    props: {
      post,
      onSave: goBack
    }
  })

  return <View style={styles.post}>
    <Text>{post.title}</Text>
    <Text style={styles.details}>
      {post.details}
    </Text>
    <Button title='Edit this post' onPress={edit} />
  </View>
}
Post.contextTypes = {
  navigate: PropTypes.func,
  goBack: PropTypes.func
}

export default Post

const styles = {
  post: {
    padding: 10,
    backgroundColor: '#fff',
    ...mixins.belowNavigationBar,
    flex: 1
  },
  details: {
    marginTop: 10,
    fontSize: 10
  }
}
