import React from 'react'
import { View, Text, Image } from 'react-native'
import Button from '../Button'
import styles from './CreateCommunityNotice.styles'
const axolotlImage = require('../../assets/hey-axolotl.png')

function CreateCommunityNotice ({goToCreateCommunityName, text}) {
  return <View style={styles.container}>
    <Text style={styles.promptText}>{text}</Text>
    <Image style={styles.image} source={axolotlImage} />
    <Button
      text='Create a Community'
      style={styles.button}
      onPress={goToCreateCommunityName}
    />
  </View>
}

export default CreateCommunityNotice
