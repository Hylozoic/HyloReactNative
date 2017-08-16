import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from '../../Icon'
import { MemberHeader } from '../MemberProfile'
import styles from './MemberDetails.styles'

export default class MemberDetail extends React.Component {
  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }
  }

  render () {
    const { person } = this.props

    return <View style={styles.container}>
      <MemberHeader person={person} />
      <View style={styles.screenMargin}>
        <MemberBio person={person} />
      </View>
    </View>
  }
}

export function MemberBio ({ person: { bio } }) {
  return <View style={styles.bioContainer}>
    <View style={styles.sectionLabel}>About Me</View>
    <Text style={styles.bio}>{bio}</Text>
  </View>
}
