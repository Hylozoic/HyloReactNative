import React from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import Icon from '../Icon'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import PopupMenuButton from '../PopupMenuButton'
import { filter, isEmpty } from 'lodash/fp'
import styles from './MemberHeader.styles'

export default function MemberHeader ({ person, flagMember, onPressMessages, isMe, editProfile }) {
  if (!person) return null

  const { name, location, tagline } = person
  return <View style={styles.header}>
    <View style={styles.nameRow}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={onPressMessages}>
          <Icon name='Messages' style={styles.icon} />
        </TouchableOpacity>
        <MemberMenu {... {flagMember, isMe, editProfile}} />
      </View>
    </View>
    <Control style={styles.location} value={location} editable />
    <Text style={styles.location}>{location}</Text>
    <Text style={styles.tagline}>{tagline}</Text>
  </View>
}

export function Control ({ value, onChange, editable, style }) {
  console.log('value', value)
  console.log('style', style)
  return <View style={styles.control}>
    <TextInput style={style} value={value} onChangeText={onChange} editable={editable} />
    {editable && <EntypoIcon name='edit' style={styles.editIcon} />}
  </View>
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
