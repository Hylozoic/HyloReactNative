import React from 'react'
import { Button, KeyboardAvoidingView, TextInput, View } from 'react-native'
import Editor from '../Editor'
import PropTypes from 'prop-types'

export default class PostEditor extends React.Component {
  static contextTypes = {navigate: PropTypes.func}

  constructor (props) {
    super(props)
    this.state = {title: props.post.title || ''}
  }

  save = () => {
    return this.details.getContentAsync()
    .then(details => {
      console.log(this.state.title)
      console.log(details)
    })
  }

  render () {
    const { post } = this.props
    const { navigate } = this.context

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

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 64
  },
  header: {
    height: 40
  },
  titleWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'blue'
  },
  title: {
    height: 30
  }
}
