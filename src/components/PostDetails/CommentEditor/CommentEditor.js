import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import Editor from '../../Editor'
import { get } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { isIOS } from 'util/platform'
import header from 'util/header'

export default class CommentEditor extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { save, disabled } = get('state.params', navigation) || {}
    return header(navigation, {
      left: 'close',
      title: 'Comment',
      right: save && {text: 'Save', onPress: save, disabled}
    })
  }

  state = {
    saveDisabled: false
  }

  componentDidMount () {
    const { navigation, saveChanges, setCommentEdits } = this.props
    navigation.setParams({
      save: () => {
        this.setState({saveDisabled: true})
        this.editor.getContentAsync()
        .then(content => saveChanges(content))
        .then(() => this.interval && clearInterval(this.interval))
        .then(() => navigation.goBack())
      }
    })

    this.interval = setInterval(() => {
      this.editor.getContentAsync()
      .then(content => setCommentEdits(content))
    }, 1000)
  }

  componentDidUpdate (prevProps, prevState) {
    const { pending, navigation } = this.props
    const { saveDisabled } = this.state
    if ((pending && !prevProps.pending) || (saveDisabled && !prevState.saveDisabled)) {
      navigation.setParams({disabled: true})
    } else if (!pending && prevProps.pending) {
      navigation.setParams({disabled: false})
    }
  }

  componentWillUnmount () {
    if (this.interval) clearInterval(this.interval)
  }

  editorView = () => {
    const { content, navigation } = this.props
    return <Editor ref={ref => { this.editor = ref }}
      initialContent={content}
      navigation={navigation}
      placeholder='Add a comment?'
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
