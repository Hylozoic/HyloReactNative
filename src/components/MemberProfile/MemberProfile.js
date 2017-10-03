import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import Loading from '../Loading'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'
import PopupMenuButton from '../../components/PopupMenuButton'
import FlagContent from '../../components/FlagContent'
import { filter, isEmpty } from 'lodash/fp'

export default class MemberProfile extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'Member'
  })

  state = {
    flaggingVisible: false
  }

  componentDidMount () {
    this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchPerson()
    }
  }

  render () {
    const { person, id, goToDetails, canFlag } = this.props

    const { flaggingVisible } = this.state

    if (!person) return <Loading />

    let flagMember
    if (canFlag) {
      flagMember = () => {
        this.setState({flaggingVisible: true})
      }
    }

    // Used to generate a link to this post from the backend.
    const linkData = {
      id,
      type: 'member'
    }

    const header = <View>
      <MemberBanner person={person} />
      <View style={styles.marginContainer}>
        <MemberHeader person={person} flagMember={flagMember} />
        <ReadMoreButton goToDetails={goToDetails} />
      </View>
      {flaggingVisible && <FlagContent type='member'
        linkData={linkData}
        onClose={() => this.setState({flaggingVisible: false})} />
      }
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

export function MemberHeader ({ person, flagMember }) {
  if (!person) return null
  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.icons}>
        <Icon name='Messages' style={styles.icon} />
        <MemberMenu {... {flagMember}} />
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

export function MemberMenu ({flagMember}) {
  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
    ['Flag This Member', flagMember]
  ])

  if (isEmpty(actions)) return null

  const onSelect = index => actions[index][1]()

  const destructiveButtonIndex = actions[0][0] === 'Flag This Member' ? 0 : -1

  return <PopupMenuButton actions={actions.map(x => x[0])} onSelect={onSelect}
    destructiveButtonIndex={destructiveButtonIndex}>
    <Icon name='More' style={styles.lastIcon} />
  </PopupMenuButton>
}
