import React from 'react'
import { Button, KeyboardAvoidingView } from 'react-native'
import Editor from '../../Editor'
import { get } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { isIOS } from 'util/platform'

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

  editorView = () => {
    const { content, navigation } = this.props
    return <Editor ref={ref => { this.editor = ref }}
      initialContent={content}
      navigation={navigation}
      placeholder='Whats your comment?'
      communityId={navigation.state.params.communityId} />
  }

  render () {
    return isIOS
      ? <KeyboardAvoidingView style={styles.container} {...kavProps}>
        {this.editorView()}
      </KeyboardAvoidingView>
      : this.editorView()
  }
}

const styles = {
  container: {
    flex: 1
  }
}
