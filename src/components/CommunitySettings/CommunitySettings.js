import React from 'react'
import { Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import Loading from '../Loading'
import styles from './CommunitySettings.styles'
import ImagePicker from '../ImagePicker'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from '../../assets/default-user-banner.jpg'
import header, { HeaderButton } from 'util/header'
import { some } from 'lodash/fp'

export default class CommunitySettings extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const saveChanges = navigation.getParam('saveChanges', () => {})
    const pendingSave = navigation.getParam('pendingSave', false)

    return header(navigation, {
      headerBackButton: () => navigation.goBack(),
      title: 'Community Information',
      options: {
        headerBackTitle: null,
        headerRight: <HeaderButton
          disabled={pendingSave}
          onPress={saveChanges}
          text={pendingSave ? 'Saving' : 'Save'} />
      }
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      edits: {}
    }
    this.props.navigation.setParams({
      saveChanges: this.saveChanges
    })
  }

  componentDidMount () {
    this.props.fetchCommunitySettings()
    this.syncLocalFields()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.fetchCommunitySettings()
    }

    const hasChanged = key => prevProps.community[key] !== this.props.community[key]

    if (some(hasChanged, ['name', 'description', 'location'])) {
      this.syncLocalFields()
    }

    if (prevProps.pendingSave !== this.props.pendingSave) {
      this.props.navigation.setParams({
        pendingSave: this.props.pendingSave
      })
    }
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.isFocused
  }

  syncLocalFields () {
    const { community } = this.props
    this.setState({
      edits: {
        name: community.name,
        location: community.location,
        description: community.description
      }
    })
  }

  updateField = key => value => {
    this.setState({
      edits: {
        ...this.state.edits,
        [key]: value
      }
    })
  }

  archiveCommunity = () => {
    // TODO
  }

  saveChanges = () => {
    this.props.updateCommunitySettings(this.state.edits)
  }

  render () {
    const {
      isFocused,
      community,
      updateCommunitySettings
    } = this.props
    if (!community) return <Loading />

    const { name, description, location } = this.state.edits

    return <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TextInput
        style={styles.nameInput}
        onChangeText={this.updateField('name')}
        value={name}
        underlineColorAndroid='transparent' />
      <CommunityBanner
        isFocused={isFocused}
        community={community}
        updateCommunitySettings={updateCommunitySettings} />
      <Text style={styles.label}>DESCRIPTION</Text>
      <TextInput
        ref={i => { this.input = i }}
        style={styles.input}
        value={description}
        onChangeText={this.updateField('description')}
        multiline
        numberOfLines={5}
        underlineColorAndroid='transparent' />
      <Text style={styles.label}>LOCATION</Text>
      <TextInput
        ref={i => { this.input = i }}
        style={styles.input}
        value={location}
        onChangeText={this.updateField('location')}
        underlineColorAndroid='transparent' />
    </ScrollView>
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

    this.props.updateCommunitySettings({[remoteKey]: remote})
  }

  render () {
    const { community: { id, avatarUrl, bannerUrl } } = this.props
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
        onPendingChange={pending => this.setState({bannerPickerPending: pending})}>
        <Image source={bannerSource} style={styles.bannerImage} />
        <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />
      </ImagePicker>
      <View style={styles.avatarW3}>
        <ImagePicker
          style={styles.avatarWrapperWrapper}
          title='Change Avatar'
          type='userAvatar'
          id={id}
          onChoice={choice => this.onChoice(choice, 'avatar')}
          onPendingChange={pending => this.setState({avatarPickerPending: pending})}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarSource} style={styles.avatarImage} />
            <EditButton isLoading={avatarPickerPending} style={styles.avatarEditButton} />
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
