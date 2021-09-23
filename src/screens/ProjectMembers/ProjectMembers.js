/* eslint-disable camelcase */
import React from 'react'
import { View } from 'react-native'
import styles from './ProjectMembers.styles'
import MemberList from 'components/MemberList/MemberList'

export default function ProjectMembers ({ route, navigation }) {
  const { members } = route.params
  const showMember = id => navigation.navigate('Member - Modal', { id })

  return (
    <View style={styles.container}>
      <MemberList
        members={members}
        hideSortOptions
        showMember={showMember}
      />
    </View>
  )
}
