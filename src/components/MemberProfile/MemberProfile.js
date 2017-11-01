import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import Loading from '../Loading'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'
import ImagePicker from '../ImagePicker'
import PopupMenuButton from '../PopupMenuButton'
import FlagContent from '../FlagContent'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import { filter, isEmpty } from 'lodash/fp'
import defaultBanner from '../../assets/default-user-banner.jpg'

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
    const { person, id, goToDetails, canFlag, onPressMessages, isMe, goToEdit } = this.props
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
      <MemberBanner person={person} isMe={isMe} />
      <View style={styles.marginContainer}>
        <MemberHeader
          person={person}
          flagMember={flagMember}
          onPressMessages={onPressMessages}
          isMe={isMe}
          goToEdit={goToEdit} />
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

export class MemberBanner extends React.Component {
  state = {
    avatarPickerPending: false,
    bannerPickerPending: false
  }

  onChoice ({ local, remote }, type) {
    console.log('local', local, 'remote', remote, 'type', type)
  }

  render () {
    const { person: { id, avatarUrl, bannerUrl }, isMe } = this.props
    const banner = bannerUrl ? {uri: bannerUrl} : defaultBanner
    const { avatarPickerPending, bannerPickerPending } = this.state

    return <View>
      <ImagePicker
        style={styles.bannerWrapper}
        title='Change Banner'
        type='userBanner'
        id={id}
        onChoice={choice => this.onChoice(choice, 'userBanner')}
        onPendingChange={pending => this.setState({bannerPickerPending: pending})}
        disabled={!isMe}>
        <Image source={banner} style={styles.bannerImage} />
        {isMe && <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />}
      </ImagePicker>
      <ImagePicker
        title='Change Avatar'
        type='userAvatar'
        id={id}
        onChoice={choice => this.onChoice(choice, 'userAvatar')}
        onPendingChange={pending => this.setState({avatarPickerPending: pending})}
        disabled={!isMe}>
        <View style={styles.avatarWrapper}>
          <Image source={{uri: avatarUrl}} style={styles.avatarImage} />
          {isMe && <EditButton isLoading={avatarPickerPending} style={styles.avatarEditButton} />}
        </View>
      </ImagePicker>
    </View>
  }
}

export function EditButton ({ isLoading, style }) {
  return <View style={[styles.editButton, style]}>
    {isLoading
      ? <Text style={styles.editButtonText}>loading</Text>
      : <View style={{flexDirection: 'row'}}>
        <EntypoIcon name='edit' style={styles.editIcon} />
        <Text style={styles.editButtonText}>edit</Text>
      </View>}
  </View>
}

export function MemberHeader ({ person, flagMember, onPressMessages, isMe, goToEdit }) {
  if (!person) return null

  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={onPressMessages}>
          <Icon name='Messages' style={styles.icon} />
        </TouchableOpacity>
        <MemberMenu {... {flagMember, isMe, goToEdit}} />
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

export function MemberMenu ({flagMember, isMe, goToEdit}) {
  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
    ['Edit', isMe && goToEdit],
    ['Flag This Member', !isMe && flagMember]
  ])

  if (isEmpty(actions)) return null

  const onSelect = index => actions[index][1]()

  const destructiveButtonIndex = actions[0][0] === 'Flag This Member' ? 0 : -1

  return <PopupMenuButton actions={actions.map(x => x[0])} onSelect={onSelect}
    destructiveButtonIndex={destructiveButtonIndex}>
    <Icon name='More' style={styles.lastIcon} />
  </PopupMenuButton>
}
