import React from 'react'
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import styles from './NewMessage.styles'
import { capeCod40 } from '../../style/colors'
import { isEmpty } from 'lodash/fp'

export default class NewMessage extends React.Component {

  componentDidMount () {
    this.props.fetchContacts()
    this.props.fetchRecentContacts()
  }

  componentDidUpdate (prevProps) {
    const { participantInputText, fetchSuggestions } = this.props
    if (prevProps.participantInputText !== participantInputText) {
      fetchSuggestions()
    }
  }

  render () {
    const {
      recentContacts,
      allContacts,
      suggestions,
      currentUser,
      participants,
      addParticipant,
      removeParticipant,
      setParticipantInput,
      participantInputText
     } = this.props

    return <View style={styles.container}>
      <ParticipantInput
        participants={participants}
        removeParticipant={removeParticipant}
        onChangeText={setParticipantInput}
        text={participantInputText} />
      {!isEmpty(suggestions) && <ContactList
        contacts={suggestions}
        addParticipant={addParticipant} />}
      {isEmpty(suggestions) && <ContactList
        label='Recent'
        contacts={recentContacts}
        addParticipant={addParticipant} />}
      {isEmpty(suggestions) && <ContactList
        label='All Contacts'
        contacts={allContacts}
        grayed
        addParticipant={addParticipant} />}
      <MessagePrompt currentUser={currentUser} />
    </View>
  }
}

export function ParticipantInput ({ participants, onChangeText, removeParticipant, text }) {
  const { width } = Dimensions.get('window')
  const inputStyle = {width: width - 30}
  return <ScrollView contentContainerStyle={styles.scrollViewContainer} horizontal>
    {participants.map(p => <Participant participant={p} key={p.id} remove={removeParticipant} />)}
    <TextInput
      value={text}
      onChangeText={onChangeText}
      style={[styles.participantTextInput, inputStyle]} />
  </ScrollView>
}

export function Participant ({ participant, remove }) {
  return <View style={styles.participant}>
    <Avatar avatarUrl={participant.avatarUrl} style={styles.participantAvatar} dimension={24} />
    <Text style={styles.contactName}>{participant.name}</Text>
    <TouchableOpacity onPress={() => remove(participant.id)}>
      <Icon name='Ex' style={styles.closeIcon} />
    </TouchableOpacity>
  </View>
}

export function ContactList ({ contacts, label, grayed, addParticipant }) {
  return <View style={styles.contactList}>
    {label && <Text style={styles.listLabel}>{label}</Text>}
    {contacts.map(c =>
      <ContactRow contact={c} grayed={grayed} key={c.id} add={addParticipant} />)}
  </View>
}

export function ContactRow ({ contact, grayed, add }) {
  return <TouchableOpacity onPress={() => add(contact.id)}>
    <View style={[styles.contactRow, grayed && styles.grayed]}>
      <Avatar avatarUrl={contact.avatarUrl} style={styles.contactAvatar} dimension={30} />
      <Text style={styles.contactName}>{contact.name}</Text>
    </View>
  </TouchableOpacity>
}

export function MessagePrompt ({ currentUser }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  return <View style={styles.promptContainer}>
    <View style={styles.messagePrompt}>
      <Avatar avatarUrl={avatarUrl} style={styles.promptAvatar} dimension={30} />
      <TextInput style={styles.promptTextInput}
        placeholder='Type your message here'
        placeholderTextColor={capeCod40} />
    </View>
    <View style={styles.promptShadow} />
  </View>
}
