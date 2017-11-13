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
  errors = {}
}) {
  if (!person) return null

  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Control
        style={styles.name}
        value={name}
        editable={editable}
        onChangeText={updateSetting('name')}
        error={errors.name} />
      <View style={styles.icons}>
        <TouchableOpacity onPress={onPressMessages}>
          <Icon name='Messages' style={styles.icon} />
        </TouchableOpacity>
        <MemberMenu {... {flagMember, isMe, editProfile, saveChanges, editable}} />
      </View>
    </View>
    <Control
      style={styles.location}
      value={location}
      editable={editable}
      onChangeText={updateSetting('location')} />
    <Control
      style={styles.tagline}
      value={tagline}
      editable={editable}
      onChangeText={updateSetting('tagline')} />
  </View>
}

export class Control extends React.Component {
  focus = () => {
    this.input && this.input.focus()
  }

  render () {
    const { value, onChangeText, editable, style, onBlur, multiline, hideEditIcon, error } = this.props
    return <View style={[styles.control, editable && styles.editableControl]}>
      <View style={styles.controlInputRow}>
        <TextInput
          ref={i => { this.input = i }}
          style={[styles.controlInput, style]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onBlur={onBlur}
          multiline={multiline} />
        {editable && !hideEditIcon && <TouchableOpacity onPress={this.focus} style={styles.editIconWrapper}>
          <EntypoIcon name='edit' style={styles.editIcon} />
        </TouchableOpacity>}
      </View>
      {!!error && <View style={styles.controlError}><Text style={styles.controlErrorText}>{error}</Text></View>}
    </View>
  }
}

export function MemberMenu ({flagMember, isMe, editProfile, saveChanges, editable}) {
  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
    ['Edit', isMe && !editable && editProfile],
    ['Save Changes', isMe && editable && saveChanges],
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
