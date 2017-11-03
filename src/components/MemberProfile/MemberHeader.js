import React from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import Icon from '../Icon'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import PopupMenuButton from '../PopupMenuButton'
import { filter, isEmpty } from 'lodash/fp'
import styles from './MemberHeader.styles'

export default function MemberHeader ({
  person, flagMember, onPressMessages, isMe, editProfile, editable, updateSetting, saveChanges
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
        onBlur={saveChanges} />
      <View style={styles.icons}>
        <TouchableOpacity onPress={onPressMessages}>
          <Icon name='Messages' style={styles.icon} />
        </TouchableOpacity>
        <MemberMenu {... {flagMember, isMe, editProfile}} />
      </View>
    </View>
    <Control
      style={styles.location}
      value={location}
      editable={editable}
      onChangeText={updateSetting('location')}
      onBlur={saveChanges} />
    <Control
      style={styles.tagline}
      value={tagline}
      editable={editable}
      onChangeText={updateSetting('tagline')}
      onBlur={saveChanges} />
  </View>
}

export class Control extends React.Component {
  focusInput = () => {
    this.input && this.input.focus()
  }

  render () {
    const { value, onChangeText, editable, style, onBlur, multiline } = this.props
    return <View style={[styles.control, editable && styles.editableControl]}>
      <TextInput
        ref={i => { this.input = i }}
        style={[styles.controlInput, style]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        onBlur={onBlur}
        multiline={multiline} />
      {editable && <TouchableOpacity onPress={this.focusInput} style={styles.editIconWrapper}>
        <EntypoIcon name='edit' style={styles.editIcon} />
      </TouchableOpacity>}
    </View>
  }
}

export function MemberMenu ({flagMember, isMe, editProfile}) {
  // If the function is defined, than it's a valid action
  const actions = filter(x => x[1], [
    ['Edit', isMe && editProfile],
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
