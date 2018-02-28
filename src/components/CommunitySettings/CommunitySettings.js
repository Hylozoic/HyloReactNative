import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Loading from '../Loading'
import styles from './CommunitySettings.styles'
import ImagePicker from '../ImagePicker'
import FlagContent from '../FlagContent'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from '../../assets/default-user-banner.jpg'
import header from 'util/header'

export default class CommunitySettings extends React.Component {
  static navigationOptions = ({ navigation }) =>
    header(navigation, {
      headerBackButton: () => navigation.navigate('Members'),
      title: 'Community Information',
      options: {
        headerBackTitle: null
      }
    })

  state = {
    flaggingVisible: false
  }

  componentDidMount () {
    // this.props.fetchPerson()
  }

  componentDidUpdate (prevProps) {
    // if (prevProps.id !== this.props.id) {
    //   this.props.fetchPerson()
    // }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  render () {
    const {
      canFlag,
      goToEdit,
      id,
      isFocused,
      canEdit,
      onPressMessages,
      community,
      updateUserSettings
    } = this.props
    const { flaggingVisible } = this.state
    if (!community) return <Loading />

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

    return <View>
      <CommunityBanner
        isFocused={isFocused}
        canEdit={canEdit}
        community={community}
        updateUserSettings={updateUserSettings} />
      {flaggingVisible && <FlagContent type='member'
        linkData={linkData}
        onClose={() => this.setState({flaggingVisible: false})} />
      }
    </View>
  }
}

export class CommunityBanner extends React.Component {
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
    const { community: { id, avatarUrl, bannerUrl }, canEdit } = this.props
    const { avatarPickerPending, bannerPickerPending, avatarLocalUri, bannerLocalUri } = this.state

    const avatarSource = avatarLocalUri
      ? {uri: avatarLocalUri}
      : avatarUrl && {uri: avatarUrl}

    // This is a suprisingly annoying piece of logic. Basically, prefer
    // displaying `bannerLocalUri`, then `bannerUrl`, then `defaultBanner`.
    // However, don't display `defaultBanner` only to be replaced with
    // `bannerUrl` after the request finishes! The trick to it is this:
    // `bannerUrl` will be undefined until the request finishes, then it should
    // be either string or null. So we don't display the default unless it's null.

    let bannerSource = {
      uri: bannerLocalUri || bannerUrl
    }
    if (bannerUrl === null && bannerLocalUri === null) {
      bannerSource = defaultBanner
    }

    return <View>
      <ImagePicker
        title='Change Banner'
        type='userBanner'
        style={styles.bannerImagePicker}
        id={id}
        onChoice={choice => this.onChoice(choice, 'banner')}
        onPendingChange={pending => this.setState({bannerPickerPending: pending})}
        disabled={!canEdit}>
        <Image source={bannerSource} style={styles.bannerImage} />
        {canEdit && <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />}
      </ImagePicker>
      <View style={styles.avatarW3}>
        <ImagePicker
          style={styles.avatarWrapperWrapper}
          title='Change Avatar'
          type='userAvatar'
          id={id}
          onChoice={choice => this.onChoice(choice, 'avatar')}
          onPendingChange={pending => this.setState({avatarPickerPending: pending})}
          disabled={!canEdit}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatarImage} />
            {canEdit && <EditButton isLoading={avatarPickerPending} style={styles.avatarEditButton} />}
          </View>
        </ImagePicker>
      </View>
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
