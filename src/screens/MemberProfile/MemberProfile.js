import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation, useRoute } from '@react-navigation/native'
import { isModalScreen } from 'navigation/linking/helpers'
import Loading from 'components/Loading'
import MemberFeed from './MemberFeed'
import MemberHeader from './MemberHeader'
import ImagePicker from 'components/ImagePicker'
import FlagContent from 'components/FlagContent'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from 'assets/default-user-banner.jpg'
import styles from './MemberProfile.styles'
import ModalHeaderTransparent from 'navigation/headers/ModalHeaderTransparent'

export const blockUserWithNav = async ({ navigation, person, blockUser }) => {
  await blockUser(person.id)
  navigation.goBack()
}

export default function MemberProfile ({
  isBlocked,
  canFlag,
  goToDetails,
  goToEdit,
  goToEditAccount,
  goToManageNotifications,
  goToBlockedUsers,
  id,
  isFocused,
  isMe,
  onPressMessages,
  blockUser,
  person,
  updateUserSettings,
  fetchPerson,
  currentGroup
}) {
  const navigation = useNavigation()
  const route = useRoute()

  const [flaggingVisible, setFlaggingVisible] = useState(false)

  const setHeader = () => {
    isModalScreen(route.name)
      ? navigation.setOptions(ModalHeaderTransparent({ navigation }))
      : navigation.setOptions({ title: currentGroup.name })
  }

  const handleBlockUser = async () => {
    await blockUser(person.id)

    navigation.goBack()
  }

  useEffect(() => {
    if (isBlocked) return navigation.goBack()
    fetchPerson()
    setHeader()
  }, [id])

  useEffect(() => {
    setHeader()
  }, [currentGroup?.name])

  if (!person) return <Loading />

  // Used to generate a link to this post from the backend.
  const linkData = {
    id,
    type: 'member'
  }
  const header = (
    <View>
      <MemberBanner
        isFocused={isFocused}
        isMe={isMe}
        person={person}
        updateUserSettings={updateUserSettings}
      />
      <View style={styles.marginContainer}>
        <MemberHeader
          person={person}
          flagMember={canFlag && (() => setFlaggingVisible(true))}
          blockUser={handleBlockUser}
          onPressMessages={onPressMessages}
          isMe={isMe}
          goToEdit={goToEdit}
          goToEditAccount={goToEditAccount}
          goToManageNotifications={goToManageNotifications}
          goToBlockedUsers={goToBlockedUsers}
        />
        <ReadMoreButton goToDetails={goToDetails} />
      </View>
      {flaggingVisible && (
        <FlagContent
          type='member'
          linkData={linkData}
          onClose={() => setFlaggingVisible(false)}
        />
      )}
    </View>
  )

  return <MemberFeed id={id} header={header} navigation={navigation} />
}
export class MemberBanner extends React.Component {
  state = {
    avatarPickerPending: false,
    bannerPickerPending: false,
    avatarLocalUri: null,
    bannerLocalUri: null
  }

  handleBannerImageUpload ({ local, remote }, prefix) {
    // TODO: Show loading indicator over local image until remote is available
    // and don't `updateGroupSettings` until remote image is available.
    // See use in PostEditor.
    if (remote) {
      const localKey = `${prefix}LocalUri`
      const remoteKey = `${prefix}Url`
      this.setState({
        [localKey]: local
      })

      this.props.updateUserSettings({ [remoteKey]: remote })
    }
  }

  render () {
    const { person: { id, avatarUrl, bannerUrl }, isMe } = this.props
    const { avatarPickerPending, bannerPickerPending, avatarLocalUri, bannerLocalUri } = this.state

    const avatarSource = avatarLocalUri
      ? { uri: avatarLocalUri }
      : avatarUrl && { uri: avatarUrl }

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

    return (
      <View>
        <ImagePicker
          title='Change Banner'
          type='userBanner'
          style={styles.bannerImagePicker}
          id={id}
          onChoice={choice => this.handleBannerImageUpload(choice, 'banner')}
          onPendingChange={pending => this.setState({ bannerPickerPending: pending })}
          disabled={!isMe}
        >
          <FastImage source={bannerSource} style={styles.bannerImage} />
          {isMe && <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />}
        </ImagePicker>
        <View style={styles.avatarW3}>
          <ImagePicker
            style={styles.avatarWrapperWrapper}
            title='Change Avatar'
            type='userAvatar'
            id={id}
            onChoice={choice => this.handleBannerImageUpload(choice, 'avatar')}
            onPendingChange={pending => this.setState({ avatarPickerPending: pending })}
            disabled={!isMe}
          >
            <View style={styles.avatarWrapper}>
              <FastImage source={avatarSource} style={styles.avatarImage} />
              {isMe && <EditButton isLoading={avatarPickerPending} style={styles.avatarEditButton} />}
            </View>
          </ImagePicker>
        </View>
      </View>
    )
  }
}

export function EditButton ({ isLoading, style }) {
  return (
    <View style={[styles.editButton, style]}>
      {isLoading
        ? <Text style={styles.editButtonText}>loading</Text>
        : (
          <View style={{ flexDirection: 'row' }}>
            <EntypoIcon name='edit' style={styles.editIcon} />
            <Text style={styles.editButtonText}>edit</Text>
          </View>
          )
      }
    </View>
  )
}

export function ReadMoreButton ({ goToDetails }) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={goToDetails} style={styles.buttonWrapper}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Read More</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
