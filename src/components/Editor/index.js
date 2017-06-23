import React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor'

export default class Editor extends React.Component {
  getContentAsync () {
    return this.editor.getContentHtml()
  }

  render () {
    return <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.wrapper}>
        <RichTextEditor initialContentHTML={this.props.initialContent}
          hiddenTitle
          ref={ref => { this.editor = ref }}
          titlePlaceholder='title'
          contentPlaceholder='details' />
      </View>
      <RichTextToolbar getEditor={() => this.editor} />
    </KeyboardAvoidingView>
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  wrapper: {
    flex: 1
  }
}
