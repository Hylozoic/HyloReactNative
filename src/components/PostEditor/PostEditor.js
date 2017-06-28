import React from 'react'
import { Button, KeyboardAvoidingView, TextInput, View } from 'react-native'
import Editor from '../Editor'
import PropTypes from 'prop-types'
import styles from './PostEditor.styles'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  constructor (props) {
    super(props)
    this.state = {title: props.post.title || ''}
  }

  save = () => {
    return this.details.getContentAsync()
    .then(details => {
      const { post } = this.props
      if (post && post.id) {
        this.props.updatePost({
          ...post,
          title: this.state.title,
          details
        })
        .then(({ error }) => error || this.props.onSave())
      }
    })
  }

  render () {
    const { post } = this.props

    return <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.header}>
        <Button title='Save' onPress={this.save} />
      </View>
      <View style={styles.titleWrapper}>
        <TextInput value={this.state.title} style={styles.title}
          onChangeText={title => this.setState({title})} />
      </View>
      <Editor initialContent={post.details}
        ref={ref => { this.details = ref }} />
    </KeyboardAvoidingView>
  }
}
