import React from 'react'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import Icon from '../Icon'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import PopupMenuButton from '../PopupMenuButton'
import { filter, isEmpty } from 'lodash/fp'
import styles from './MemberHeader.styles'

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
  blockUser
}) {
  if (!person) return null

  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Control
        style={styles.name}
        value={name}
        placeholder='Name'
        editable={editable}
        onChangeText={updateSetting('name')}
        error={errors.name}
        isMe={isMe} />
      <View style={styles.icons}>
        <TouchableOpacity onPress={onPressMessages}>
          <Icon name='Messages' style={styles.icon} />
        </TouchableOpacity>
        <MemberMenu {... {flagMember, isMe, editProfile, saveChanges, editable, blockUser}} />
      </View>
    </View>
    <Control
      style={styles.location}
      value={location}
      placeholder='Location'
      editable={editable}
      onChangeText={updateSetting('location')}
      isMe={isMe} />
    <Control
      style={styles.tagline}
      value={tagline}
      placeholder='Short Description'
      editable={editable}
      onChangeText={updateSetting('tagline')}
      isMe={isMe} />
  </View>
}

export class Control extends React.Component {
  focus = () => this.input && this.input.focus()

  render () {
    const {
      value, onChangeText, editable = false, style, multiline,
      hideEditIcon, error, placeholder, isMe
    } = this.props
    return <View style={[styles.control, editable && styles.editableControl]}>
      <View style={styles.controlInputRow}>
        {editable || !multiline
          ? <TextInput
            ref={i => { this.input = i }}
            style={[styles.controlInput, style]}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            placeholder={isMe ? placeholder : ''}
            multiline={multiline}
            numberOfLines={multiline ? 8 : 1}
            underlineColorAndroid='transparent' />
          : <Text>{value}</Text>}
        {editable && !hideEditIcon && <TouchableOpacity onPress={this.focus} style={styles.editIconWrapper}>
          <EntypoIcon name='edit' style={styles.editIcon} />
        </TouchableOpacity>}
      </View>
      {!!error && <View style={styles.controlError}><Text style={styles.controlErrorText}>{error}</Text></View>}
    </View>
  }
}

export function MemberMenu ({flagMember, isMe, blockUser, editProfile, saveChanges, editable}) {
  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
    ['Edit', isMe && !editable && editProfile],
    ['Save Changes', isMe && editable && saveChanges],
    ['Flag This Member', !isMe && flagMember],
    ['Block This Member', !isMe && blockUser]
  ])

  if (isEmpty(actions)) return null

  const destructiveButtonIndex = actions[0][0] === 'Flag This Member' ? 0 : -1

  return <PopupMenuButton actions={actions}
    destructiveButtonIndex={destructiveButtonIndex}>
    <Icon name='More' style={styles.lastIcon} />
  </PopupMenuButton>
}
