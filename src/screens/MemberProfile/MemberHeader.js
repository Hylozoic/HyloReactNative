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

export default function MemberHeader ({
  person,
  flagMember,
  onPressMessages,
  isMe,
  editProfile,
  editAccount,
  editable,
  updateSetting = () => {},
  saveChanges,
  errors = {},
  ...props
}) {
  if (!person) return null

  const { name, location, tagline } = person
  const blockUser = blockUserWithConfirmationFun(props.blockUser, name)
  const isAxolotl = AXOLOTL_ID === get('id', person)

  return (
    <View style={styles.header}>
      <View style={styles.nameRow}>
        <Control
          style={styles.name}
          value={name}
          placeholder='Name'
          editable={editable}
          onChangeText={updateSetting('name')}
          error={errors.name}
          isMe={isMe}
        />
        <View style={styles.icons}>
          {!isMe &&<TouchableOpacity onPress={onPressMessages}>
            <Icon name='Messages' style={styles.icon} />
          </TouchableOpacity>}
          <MemberMenu {...{
            flagMember, isMe, editProfile, editAccount,
            saveChanges, editable, blockUser, isAxolotl
          }} />
        </View>
      </View>
      <Control
        style={styles.location}
        value={location}
        placeholder='Location'
        editable={editable}
        onChangeText={updateSetting('location')}
        isMe={isMe}
      />
      <Control
        style={styles.tagline}
        value={tagline}
        placeholder='Short Description'
        editable={editable}
        onChangeText={updateSetting('tagline')}
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
export class Control extends React.Component {
  inputRef = React.createRef()

  focus = () => this.inputRef.current && this.inputRef.current.focus()

  render () {
    const {
      value, onChangeText, editable = false, style, multiline,
      hideEditIcon, error, placeholder, isMe
    } = this.props
    return (
      <View style={[styles.control, editable && styles.editableControl]}>
        <View style={styles.controlInputRow}>
          {editable || !multiline
            ? <TextInput
                ref={this.inputRef}
                style={[styles.controlInput, style]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                placeholder={isMe ? placeholder : ''}
                multiline={multiline}
                numberOfLines={multiline ? 8 : 1}
                underlineColorAndroid='transparent'
              />
            : <Text>{value}</Text>}
          {editable && !hideEditIcon && <TouchableOpacity onPress={this.focus} style={styles.editIconWrapper}>
            <EntypoIcon name='edit' style={styles.editIcon} />
          </TouchableOpacity>}
        </View>
        {!!error && <View style={styles.controlError}><Text style={styles.controlErrorText}>{error}</Text></View>}
      </View>
    )
  }
}

export function MemberMenu ({
  flagMember, isMe, blockUser, editProfile,
  editAccount, saveChanges, editable, isAxolotl
}) {
  // If the function is defined, than it's a valid action

  const actions = filter(x => x[1], [
    ['Edit Profile', isMe && !editable && editProfile],
    ['Edit Account', isMe && !editable && editAccount],
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
