import React from 'react'
import { Text, View, Image } from 'react-native'
import Icon from '../Icon'
import styles from './MemberProfile.styles'

export default class NewMessage extends React.Component {

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
      <MemberBanner person={person} />
      <MemberHeader person={person} />
    </View>
  }
}

export function MemberBanner ({ person }) {
  const { bannerUrl, avatarUrl } = person
  return <View>
    <Image source={{uri: bannerUrl}} style={styles.bannerImage} />
    <View style={styles.avatarWrapper}>
      <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
    </View>
  </View>
}

export function MemberHeader ({ person }) {
  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.icons}>
        <Icon name='Messages' style={styles.icon} />
        <Icon name='More' style={styles.lastIcon} />
      </View>
    </View>
    <Text style={styles.location}>{location}</Text>
    <Text style={styles.tagline}>{tagline}</Text>
  </View>
}
