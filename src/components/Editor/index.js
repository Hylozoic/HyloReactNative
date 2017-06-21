import React from 'react'
import { Button, KeyboardAvoidingView, View } from 'react-native'
import { RichTextEditor, RichTextToolbar } from 'react-native-zss-rich-text-editor'

export default class Editor extends React.Component {

  save = () => {
    Promise.all([
      this.editor.getTitleText(),
      this.editor.getContentHtml()
    ])
    .then(([ title, content ]) => {
      console.log(title)
      console.log(content)
    })
  }

  render () {
    return <KeyboardAvoidingView style={styles.container} behavior='height'>
      <View style={styles.header}>
        <Button title='Save' onPress={this.save} />
      </View>
      <View style={styles.wrapper}>
        <RichTextEditor
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
  header: {
    height: 40
  },
  wrapper: {
    paddingTop: 10,
    flex: 1,
    borderWidth: 3,
    borderColor: 'blue'
  }
}
