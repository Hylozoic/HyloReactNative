/* eslint-disable camelcase */
import React from 'react'
import { TextInput, View, Button } from 'react-native'
import { KeyboardAccessoryView as KeyboardAccessoryViewLibrary } from 'react-native-keyboard-accessory'
import { white } from 'style/colors'
// https://github.com/ardaogulcan/react-native-keyboard-accessory

export default function KeyboardAccessoryView ({ children }) {
  return <KeyboardAccessoryViewLibrary
    alwaysVisible
    avoidKeyboard
    inSafeAreaView
    bumperHeight={0}
    androidAdjustResize>
    {({ isKeyboardVisible }) => children || (
      <View style={styles.textInputView}>
        {isKeyboardVisible && (
          <Button
            style={styles.textInputButton}
            title="Send"
            onPress={() => {}}
          />
        )}
        <TextInput
          placeholder="Write your message"
          underlineColorAndroid="transparent"
          style={styles.textInput}
          multiline={true}
        />
        <TextInput>#</TextInput>
      </View>
    )}
  </KeyboardAccessoryViewLibrary>
}

const styles = {
  textInputView: {
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: white
  },
  textInput: {
    flexGrow: 1,
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#CCC',
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    textAlignVertical: 'top'
  },
  textInputButton: {
    flexShrink: 1
  }
}
