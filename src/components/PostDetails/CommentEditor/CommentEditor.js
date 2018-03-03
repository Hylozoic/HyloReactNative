import React from 'react'
import { KeyboardAvoidingView, Alert } from 'react-native'
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
      right: save && {text: disabled ? 'Saving' : 'Save', onPress: save, disabled}
    })
  }

  state = {
    saveDisabled: false
  }

  componentDidMount () {
    const { navigation, saveChanges } = this.props
    navigation.setParams({
      save: () => {
        navigation.setParams({disabled: true})
        return saveChanges(this.state.content)
        .then(({ error }) => {
          if (error) {
            Alert.alert("Your comment couldn't be saved; please try again.")
          } else {
            return navigation.goBack()
          }
        })
        .catch(() => Alert.alert("Your comment couldn't be saved. Please try again."))
      }
    })
  }

  componentDidUpdate (prevProps) {
    const { pending, navigation } = this.props
    if (pending && !prevProps.pending) {
      navigation.setParams({disabled: true})
    } else if (!pending && prevProps.pending) {
      navigation.setParams({disabled: false})
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  editorView = () => {
    const { content, navigation } = this.props
    return <Editor ref={ref => { this.editor = ref }}
      initialContent={content}
      navigation={navigation}
      placeholder='Add a comment...'
      onChange={content => this.setState({content})}
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
