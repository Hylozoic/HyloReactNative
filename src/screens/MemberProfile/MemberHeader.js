import React from 'react'
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Alert
} from 'react-native'
import Icon from 'components/Icon'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import PopupMenuButton from 'components/PopupMenuButton'
import { filter, get, isEmpty } from 'lodash/fp'
import styles from './MemberHeader.styles'
import { AXOLOTL_ID } from 'store/models/Person'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import Control from 'screens/MemberProfile/Control'

export default function MemberHeader ({
  person,
  flagMember,
  onPressMessages,
  isMe,
  editProfile,
  editable,
  updateSetting = () => {},
  saveChanges,
  errors = {},
  navigation,
  ...props
}) {
  if (!person) return null

  const { name, tagline } = person
  const locationText = get('location', person)
    || get('locationObject.fullText', person)
  const blockUser = blockUserWithConfirmationFun(props.blockUser, name)
  const isAxolotl = AXOLOTL_ID === get('id', person)
  const showLocationPicker = () => {
    LocationPicker({
      navigation,
      initialSearchTerm: locationText,
      onPick: location => {
        // TODO: Figure-out how to handle locationObject selection from here
        //       LocationPicker is doing what it should
        updateSetting('location', location?.fullText)
      }
    })
  }

  return (
    <View style={styles.header}>
      <View style={styles.nameRow}>
        <Control
          style={styles.name}
          value={name}
          placeholder='Name'
          editable={editable}
          onChangeText={value => updateSetting('name', value)}
          error={errors.name}
          isMe={isMe}
        />
        <View style={styles.icons}>
          <TouchableOpacity onPress={onPressMessages}>
            <Icon name='Messages' style={styles.icon} />
          </TouchableOpacity>
          <MemberMenu {... { flagMember, isMe, editProfile, saveChanges, editable, blockUser, isAxolotl }} />
        </View>
      </View>
      <Control
        style={styles.location}
        value={locationText}
        placeholder='Location'
        editable={editable}
        onPress={showLocationPicker}
        isMe={isMe}
      />
      <Control
        style={styles.tagline}
        value={tagline}
        placeholder='Short Description'
        editable={editable}
        onChangeText={value => updateSetting('tagline', value)}
        isMe={isMe}
      />
    </View>
  )
}

export function blockUserWithConfirmationFun (blockUserFun, name) {
  return function () {
    return Alert.alert(
      `Are you sure you want to block ${name}?`,
      `You will no longer see ${name}\'s activity
      and they won't see yours.
      
      You can unblock this member at any time.
      Go to Settings > Blocked Users.`,
      [
        { text: `Block ${name}`, onPress: (blockedUserId) => blockUserFun(blockedUserId) },
        { text: 'Cancel', style: 'cancel' }
      ])
  }
}

export function MemberMenu ({ flagMember, isMe, blockUser, editProfile, saveChanges, editable, isAxolotl }) {
  // If the function is defined, than it's a valid action

  const actions = filter(x => x[1], [
    ['Edit', isMe && !editable && editProfile],
    ['Save Changes', isMe && editable && saveChanges],
    ['Flag This Member', !isMe && flagMember],
    ['Block This Member', !isMe && !isAxolotl && blockUser]
  ])

  if (isEmpty(actions)) return null

  const destructiveButtonIndex = get('1.0', actions) === 'Block This Member' ? 1 : -1

  return (
    <PopupMenuButton
      actions={actions}
      destructiveButtonIndex={destructiveButtonIndex}
    >
      <Icon name='More' style={styles.lastIcon} />
    </PopupMenuButton>
  )
}
