import React from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import Avatar from '../Avatar'
import { isEmpty } from 'lodash/fp'
import header from 'util/header'
import styles from './ThreadParticipants.styles'

export default class ThreadParticipants extends React.Component {
  static navigationOptions = ({ navigation }) =>
    header(navigation, {
      title: 'Participants',
      options: {
        headerBackTitle: null
      }
    })

  render () {
    const { participants, goToParticipant } = this.props
    if (isEmpty(participants)) {
      return <View style={styles.container}>
        <Loading />
      </View>
    }

    return <ScrollView contentContainerStyle={styles.container}>
      {participants.map(p =>
        <ParticipantRow participant={p} goToParticipant={goToParticipant} key={p.id} />)}
    </ScrollView>
  }
}

export function ParticipantRow ({ participant, goToParticipant }) {
  return <TouchableOpacity
    onPress={() => goToParticipant(participant.id)}
    style={styles.participantRow}>
    <Avatar avatarUrl={participant.avatarUrl} style={styles.avatar} />
    <Text style={styles.name}>{participant.name}</Text>
  </TouchableOpacity>
}
