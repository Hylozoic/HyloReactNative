import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'

export default class MemberProfile extends React.Component {

  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }
  }

  render () {
    const { person, id } = this.props

    const header = <View>
      <MemberBanner person={person} />
      <MemberHeader person={person} />
      <MemberBio person={person} />
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

export class MemberBio extends React.Component {
  constructor (props) {
    super(props)
    this.state = {expanded: false}
  }

  render () {
    const { person: { bio } } = this.props
    const { expanded } = this.state
    const onPress = () => this.setState({expanded: !expanded})
    const buttonText = expanded ? 'Show Less' : 'Read More'

    return <View style={styles.bioContainer}>
      {expanded && <Text style={styles.bio}>{bio}</Text>}
      <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </TouchableOpacity>
    </View>
  }
}
