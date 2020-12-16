import React from 'react'
import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import Loading from 'components/Loading'
import Avatar from 'components/Avatar'
import { isEmpty } from 'lodash/fp'
import styles from './ThreadParticipants.styles'

export default function ThreadParticipants ({ participants, goToParticipant }) {
  if (isEmpty(participants)) {
    return (
      <View style={styles.container}>
        <Loading />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {participants.map(p => (
        <ParticipantRow participant={p} goToParticipant={goToParticipant} key={p.id} />
      ))}
    </ScrollView>
  )
}

export function ParticipantRow ({ participant, goToParticipant }) {
  return (
    <TouchableOpacity
      onPress={() => goToParticipant(participant.id)}
      style={styles.participantRow}
    >
      <Avatar avatarUrl={participant.avatarUrl} style={styles.avatar} />
      <Text style={styles.name}>{participant.name}</Text>
    </TouchableOpacity>
  )
}
