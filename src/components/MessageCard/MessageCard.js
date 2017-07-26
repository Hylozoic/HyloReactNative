import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { any, func, object, shape, string } from 'prop-types'

import Avatar from '../Avatar'
import { capeCod10 } from '../../style/colors'

export default class MessageCard extends React.Component {
  static propTypes = {
    message: shape({
      id: any,
      createdAt: string,
      text: string,
      creator: shape({
        id: any,
        name: string,
        avatarUrl: string
      })
    })
  }

  render () {
    const { message } = this.props
    return <View style={styles.container}>
      <Avatar avatarUrl={message.creator.avatarUrl}/>
      <Text>{message.creator.name}</Text>
      <Text>{message.text}</Text>
      <Text>{message.createdAt}</Text>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: capeCod10,
    borderRadius: 4,
    backgroundColor: 'white'
  }
})
