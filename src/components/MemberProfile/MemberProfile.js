import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'
import MemberHeader from './MemberHeader'
import ImagePicker from '../ImagePicker'
import FlagContent from '../FlagContent'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from '../../assets/default-user-banner.jpg'
import header from 'util/header'

export default class MemberProfile extends React.Component {
  static navigationOptions = ({ navigation }) =>
    header(navigation, {
      title: 'Member',
      options: {
        headerBackTitle: null        
      }
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
    const { person, id, goToDetails, canFlag, onPressMessages, isMe, goToEdit, updateUserSettings } = this.props
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
      <MemberBanner person={person} isMe={isMe} updateUserSettings={updateUserSettings} />
      <View style={styles.marginContainer}>
        <MemberHeader
          person={person}
          flagMember={flagMember}
          onPressMessages={onPressMessages}
          isMe={isMe}
          editProfile={goToEdit} />
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
    bannerPickerPending: false,
    avatarLocalUri: null,
    bannerLocalUri: null
  }

  onChoice ({ local, remote }, prefix) {
    const localKey = `${prefix}LocalUri`
    const remoteKey = `${prefix}Url`
    this.setState({
      [localKey]: local
    })

    this.props.updateUserSettings({[remoteKey]: remote})
  }

  render () {
    const { person: { id, avatarUrl, bannerUrl }, isMe } = this.props
    const { avatarPickerPending, bannerPickerPending, avatarLocalUri, bannerLocalUri } = this.state

    const avatarSource = avatarLocalUri
      ? {uri: avatarLocalUri}
      : avatarUrl && {uri: avatarUrl}

    const bannerSource = bannerLocalUri
      ? {uri: bannerLocalUri}
      : bannerUrl ? {uri: bannerUrl} : defaultBanner

    return <View>
      <ImagePicker
        style={styles.bannerWrapper}
        title='Change Banner'
        type='userBanner'
        id={id}
        onChoice={choice => this.onChoice(choice, 'banner')}
        onPendingChange={pending => this.setState({bannerPickerPending: pending})}
        disabled={!isMe}>
        <Image source={bannerSource} style={styles.bannerImage} />
        {isMe && <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />}
      </ImagePicker>
      <ImagePicker
        title='Change Avatar'
        type='userAvatar'
        id={id}
        onChoice={choice => this.onChoice(choice, 'avatar')}
        onPendingChange={pending => this.setState({avatarPickerPending: pending})}
        disabled={!isMe}>
        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.avatarImage} />
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

export function ReadMoreButton ({ goToDetails }) {
  return <View style={styles.buttonContainer}>
    <TouchableOpacity onPress={goToDetails} style={styles.buttonWrapper}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Read More</Text>
      </View>
    </TouchableOpacity>
  </View>
}
