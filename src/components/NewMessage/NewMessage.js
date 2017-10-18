import React from 'react'
import {
  Dimensions,
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

export default class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {viewKey: 0}
  }

  componentDidMount () {
    this.props.fetchContacts()
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
      allContacts,
      suggestions,
      participants,
      addParticipant,
      removeParticipant,
      setParticipantInput,
      participantInputText,
      createMessage,
      setMessage,
      message,
      pending,
      fetchMoreContacts,
      mockViewKey // just for testing
    } = this.props

    const showSuggestions = !isEmpty(participantInputText)

    var listSections = []
    if (showSuggestions) {
      listSections = [
        {data: suggestions, loading: pending.suggestions}
      ]
    } else {
      listSections = [
        {data: recentContacts, label: 'Recent', loading: pending.recent},
        {data: allContacts, label: 'All Contacts', loading: pending.all}
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
        onEndReached={fetchMoreContacts}
        onEndReachedThreshold={0.3}
        stickySectionHeadersEnabled={false} />
      <MessageInput
        onChange={setMessage}
        value={message}
        onSubmit={createMessage}
        onBlur={this.onBlurMessageInput}
        placeholder='Type your message here' />
    </KeyboardFriendlyView>
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
        underlineColorAndroid='transparent'
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

export function renderContact (addParticipant) {
  return ({ item }) => <ContactRow contact={item} add={addParticipant} />
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
