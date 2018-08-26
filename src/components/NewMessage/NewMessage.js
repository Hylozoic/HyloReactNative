import React from 'react'
import {
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  TextInput,
  View
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import Loading from '../Loading'
import MessageInput from '../MessageInput'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import styles from './NewMessage.styles'
import { isEmpty } from 'lodash/fp'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { isIOS } from 'util/platform'

export default class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {viewKey: 0}
  }

  componentDidMount () {
    this.props.fetchRecentContacts()
    this.props.loadParticipantsFromParams()
  }

  componentDidUpdate (prevProps) {
    const { participantInputText, fetchSuggestions } = this.props
    if (prevProps.participantInputText !== participantInputText) {
      fetchSuggestions()
    }
  }

  onBlurMessageInput = () => {
    const { viewKey } = this.state
    this.setState({viewKey: viewKey + 1})
  }

  render () {
    const {
      recentContacts,
      suggestions,
      participants,
      addParticipant,
      removeParticipant,
      setParticipantInput,
      participantInputText,
      createMessage,
      pending,
      mockViewKey // just for testing
    } = this.props

    const showSuggestions = !isEmpty(participantInputText)
    const emptyParticipantsList = participants.length === 0
    var listSections = []
    if (showSuggestions) {
      listSections = [
        {data: suggestions, loading: pending.suggestions}
      ]
    } else {
      listSections = [
        {data: recentContacts, label: 'Recent', loading: pending.recent}
      ]
    }

    return <KeyboardFriendlyView
      style={styles.container}
      {...{...kavProps, behavior: 'height'}}
      key={mockViewKey || this.state.viewKey}>
      <ParticipantInput
        participants={participants}
        removeParticipant={removeParticipant}
        onChangeText={setParticipantInput}
        text={participantInputText} />
      <SectionList
        contentContainerStyle={styles.sectionList}
        renderItem={renderContact(addParticipant)}
        renderSectionHeader={SectionHeader}
        keyExtractor={item => item.id}
        sections={listSections}
        onEndReachedThreshold={0.3}
        stickySectionHeadersEnabled={false} />
      <MessageInput
        style={styles.messageInput}
        multiline
        onSubmit={createMessage}
        onBlur={this.onBlurMessageInput}
        placeholder='Type your message here'
        emptyParticipants={emptyParticipantsList}
      />
    </KeyboardFriendlyView>
  }
}

export function ParticipantInput ({ participants, onChangeText, removeParticipant, text }) {
  const placeholderText = 'Type in the names of people to message'
  return <View style={styles.scrollViewWrapper}>
    <ScrollView
      contentContainerStyle={styles.participantInputContainer}
      horizontal>
      {participants.map(p => <Participant participant={p} key={p.id} remove={removeParticipant} />)}
      <TextInput
        value={text}
        onChangeText={onChangeText}
        underlineColorAndroid='transparent'
        placeholder={placeholderText}
        style={isIOS ? null : styles.participantTextInput} />
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

export function renderContact (addParticipant) {
  return ({ item }) => <ContactRow style={styles.contactRow} contact={item} add={addParticipant} />
}

export function SectionHeader ({ section }) {
  const { label, loading } = section
  return <View style={styles.sectionHeader}>
    {label && <Text style={styles.listLabel}>{label}</Text>}
    {loading && <Loading />}
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
