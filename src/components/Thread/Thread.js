import React from 'react'
import { ScrollView } from 'react-native'
import { any, arrayOf, func, shape, string } from 'prop-types'

import AvatarInput from '../AvatarInput'
import Header from './Header'
import MessageCard from '../MessageCard'

import styles from './Thread.styles.js'

export default class Thread extends React.Component {
  static propTypes = {
    messages: arrayOf(shape({
      id: any,
      createdAt: string,
      text: string,
      creator: shape({
        id: any,
        name: string,
        avatarUrl: string
      })
    })),
    fetchMessages: func
  }

  static navigationOptions = ({ navigation }) => Header(navigation)

  componentDidMount () {
    this.props.fetchMessages()
  }

  render () {
    const { messages } = this.props
    const avatar = messages[0] ? messages[0].creator.avatarUrl : 'foo'
    return <ScrollView style={styles.container}>
      {messages.map(message => <MessageCard key={message.id} message={message} />)}
      <AvatarInput
        avatarUrl={avatar}
        multiline
        placeholder='Write something...' />
    </ScrollView>
  }
}
