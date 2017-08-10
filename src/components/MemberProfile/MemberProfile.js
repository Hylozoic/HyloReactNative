import React from 'react'
import { Text, View, Image } from 'react-native'
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
