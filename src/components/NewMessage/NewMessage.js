import React from 'react'
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  KeyboardAvoidingView
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import Loading from '../Loading'
import styles from './NewMessage.styles'
import { capeCod40 } from '../../style/colors'
import { isEmpty } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class NewMessage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {viewKey: 0}
  }

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
      participantInputText,
      createMessage,
      setMessage,
      message,
      pending
    } = this.props

    const { viewKey } = this.state

    const showSuggestions = !isEmpty(participantInputText)

    return <KeyboardAvoidingView style={styles.container} {...{...kavProps, behavior: 'height'}} key={viewKey}>
      <ParticipantInput
        participants={participants}
        removeParticipant={removeParticipant}
        onChangeText={setParticipantInput}
        text={participantInputText} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {showSuggestions && <ContactList
          contacts={suggestions}
          addParticipant={addParticipant}
          loading={pending.suggestions} />}
        {!showSuggestions && <ContactList
          label='Recent'
          contacts={recentContacts}
          addParticipant={addParticipant}
          loading={pending.recent} />}
        {!showSuggestions && <ContactList
          label='All Contacts'
          contacts={allContacts}
          grayed
          addParticipant={addParticipant}
          loading={pending.all} />}
      </ScrollView>
      <MessagePrompt
        currentUser={currentUser}
        setMessage={setMessage}
        message={message}
        createMessage={createMessage}
        onBlur={() => this.setState({viewKey: viewKey + 1})} />
    </KeyboardAvoidingView>
  }
}

export function ParticipantInput ({ participants, onChangeText, removeParticipant, text }) {
  const { width } = Dimensions.get('window')
  const inputStyle = {width: width - 30}
  return <View style={styles.scrollViewWrapper}>
    <ScrollView
      contentContainerStyle={styles.participantInputContainer}
      horizontal>
      {participants.map(p => <Participant participant={p} key={p.id} remove={removeParticipant} />)}
      <TextInput
        value={text}
        onChangeText={onChangeText}
        style={[styles.participantTextInput, inputStyle]} />
    </ScrollView>
  </View>
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

export function ContactList ({ contacts, label, grayed, addParticipant, loading }) {
  return <View style={styles.contactList}>
    {label && <Text style={styles.listLabel}>{label}</Text>}
    {loading && <Loading />}
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

export function MessagePrompt ({ currentUser, createMessage, setMessage, message, onBlur }) {
  if (!currentUser) return null
  const { avatarUrl } = currentUser
  const gray = isEmpty(message)
  return <View style={styles.promptContainer}>
    <View style={styles.messagePrompt}>
      <Avatar avatarUrl={avatarUrl} style={styles.promptAvatar} dimension={30} />
      <TextInput style={styles.promptTextInput}
        value={message}
        onChangeText={setMessage}
        onBlur={onBlur}
        placeholder='Type your message here'
        placeholderTextColor={capeCod40} />
      <TouchableOpacity onPress={() => createMessage()}>
        <Text style={[styles.sendButton, gray && styles.grayButton]}>Send</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.promptShadow} />
  </View>
}
