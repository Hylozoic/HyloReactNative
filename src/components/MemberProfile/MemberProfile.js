import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import Loading from '../Loading'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'

export default class MemberProfile extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'Member'
  })

  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }
  }

  render () {
    const { person, id, goToDetails } = this.props

    if (!person) return <Loading />

    const header = <View>
      <MemberBanner person={person} />
      <View style={styles.marginContainer}>
        <MemberHeader person={person} />
        <ReadMoreButton goToDetails={goToDetails} />
      </View>
    </View>

    return <MemberFeed id={id} header={header} />
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
  if (!person) return null
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

export function ReadMoreButton ({ goToDetails }) {
  return <View style={styles.buttonContainer}>
    <TouchableOpacity onPress={goToDetails} style={styles.buttonWrapper}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Read More</Text>
      </View>
    </TouchableOpacity>
  </View>
}
