import React from 'react'
import mixins from '../../style/mixins'
import { KeyboardAvoidingView, Text, View } from 'react-native'
import { RichTextEditor } from 'react-native-zss-rich-text-editor'

export default function () {
  return <KeyboardAvoidingView style={styles.container} behavior='height'>
    <Text style={styles.text}>hark! a text editor.</Text>
    <View style={styles.wrapper}>
      <RichTextEditor titlePlaceholder='title' contentPlaceholder='details' />
    </View>
  </KeyboardAvoidingView>
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  text: {
    ...mixins.belowStatusBar,
    marginBottom: 5,
    textAlign: 'center'
  },
  wrapper: {
    padding: 10,
    flex: 1,
    borderWidth: 3,
    borderColor: 'blue'
  }
}
