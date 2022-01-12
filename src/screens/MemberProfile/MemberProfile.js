import React, { useEffect, useState } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Loading from 'components/Loading'
import styles from './MemberProfile.styles'
import MemberFeed from './MemberFeed'
import MemberHeader from './MemberHeader'
import ImagePicker from 'components/ImagePicker'
import FlagContent from 'components/FlagContent'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import defaultBanner from 'assets/default-user-banner.jpg'
import useGroupSelect from 'hooks/useGroupSelect'

export const setHeader = ({ route, navigation, currentGroup }) => {
  if (route.name === 'Member - Modal') return
  navigation.setOptions({ title: currentGroup.name  })
}

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
  person,
  updateUserSettings,
  navigation,
  route,
  fetchPerson,
  currentGroup
}) {
  const [flaggingVisible, setFlaggingVisible] = useState(false)

  // Don't force selected group switch if this is a modal (generalize into useGroupSelect for any modal?)
  if (route.name !== 'Member - Modal') {
    useGroupSelect()
  }

  useEffect(() => {
    if (isBlocked) return navigation.goBack()
    fetchPerson()
    setHeader({ route, navigation, currentGroup })  
  }, [id])

  useEffect(() => {
    setHeader({ route, navigation, currentGroup })
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
          blockUser={() => blockUser({ navigation, person, blockUser })}
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
        <FlagContent type='member' linkData={linkData}
          onClose={() => setFlaggingVisible(false)} />
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

  onChoice ({ local, remote }, prefix) {
    const localKey = `${prefix}LocalUri`
    const remoteKey = `${prefix}Url`
    this.setState({
      [localKey]: local
    })

    this.props.updateUserSettings({ [remoteKey]: remote })
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
          onChoice={choice => this.onChoice(choice, 'banner')}
          onPendingChange={pending => this.setState({ bannerPickerPending: pending })}
          disabled={!isMe}
        >
          <Image source={bannerSource} style={styles.bannerImage} />
          {isMe && <EditButton isLoading={bannerPickerPending} style={styles.bannerEditButton} />}
        </ImagePicker>
        <View style={styles.avatarW3}>
          <ImagePicker
            style={styles.avatarWrapperWrapper}
            title='Change Avatar'
            type='userAvatar'
            id={id}
            onChoice={choice => this.onChoice(choice, 'avatar')}
            onPendingChange={pending => this.setState({ avatarPickerPending: pending })}
            disabled={!isMe}
          >
            <View style={styles.avatarWrapper}>
              <Image source={avatarSource} style={styles.avatarImage} />
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
        : <View style={{ flexDirection: 'row' }}>
          <EntypoIcon name='edit' style={styles.editIcon} />
          <Text style={styles.editButtonText}>edit</Text>
        </View>}
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
