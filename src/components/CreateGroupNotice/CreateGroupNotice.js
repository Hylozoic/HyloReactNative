import React from 'react'
import { View, Text, Image } from 'react-native'
import Button from 'components/Button'
import styles from './CreateGroupNotice.styles'
const axolotlImage = require('assets/hey-axolotl.png')

function CreateGroupNotice ({ goToCreateGroup, text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>{text}</Text>
      <Image style={styles.image} source={axolotlImage} />
      <Button
        text='Start a Group'
        style={styles.button}
        onPress={goToCreateGroup}
      />
    </View>
  )
}

export default CreateGroupNotice
