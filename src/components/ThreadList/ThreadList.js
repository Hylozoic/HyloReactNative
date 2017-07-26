import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { isEmpty } from 'lodash/fp'

import Loading from '../Loading'
import ThreadCard from '../ThreadCard'
import Header from './Header'
import styles from './ThreadList.styles'

export default class ThreadList extends Component {
  static navigationOptions = ({navigation}) => (Header(navigation))
  componentDidMount () {
    if (isEmpty(this.props.threads)) this.props.fetchThreads()
  }

  _keyExtractor = (item, index) => item.id;

  render () {
    const { threads, pending, currentUser } = this.props

    if (pending) return <Loading />
    if (!pending && threads.length === 0) {
      return <Text style={styles.center}>No active conversations</Text>
    }

    return <View style={styles.threadList}>
      <FlatList
        data={threads}
        keyExtractor={this._keyExtractor}
        renderItem={({ item }) =>
          <MessageRow
            participants={item.participants}
            message={item.messages[0]}
            currentUser={currentUser}
         />}
        />
      {!pending && threads.length === 0 &&
        <Text style={styles.center}>No active conversations</Text>
      }
    </View>
  }
}

export function MessageRow ({message, participants, currentUser}) {
  return <View>
    <TouchableOpacity onPress={() => console.log('showMessage')}>
      <ThreadCard
        message={message}
        participants={participants}
        currentUser={currentUser}
      />
    </TouchableOpacity>
  </View>
}
