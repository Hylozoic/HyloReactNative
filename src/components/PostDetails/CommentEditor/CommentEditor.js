import React from 'react'
import { Button, Platform, KeyboardAvoidingView } from 'react-native'
import Editor from '../../Editor'
import { get } from 'lodash/fp'

const keyboardVerticalOffset = Platform.os === 'ios' ? 64 : 80

export default class CommentEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { save } = get('state.params', navigation) || {}
    return {
      headerTitle: 'Comment',
      headerRight: save ? <Button title='Save' onPress={save} /> : null
    }
  }

  componentDidMount () {
    const { navigation, saveChanges, setCommentEdits } = this.props
    navigation.setParams({
      save: () =>
        this.editor.getContentAsync()
        .then(content => saveChanges(content))
        .then(() => this.interval && clearInterval(this.interval))
        .then(() => navigation.goBack())
    })

    this.interval = setInterval(() => {
      this.editor.getContentAsync()
      .then(content => setCommentEdits(content))
    }, 1000)
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval)
  }

  render () {
    return <KeyboardAvoidingView style={styles.container} behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <Editor ref={ref => { this.editor = ref }}
        initialContent={this.props.content} />
    </KeyboardAvoidingView>
  }
}

const styles = {
  container: {
    flex: 1
  }
}
