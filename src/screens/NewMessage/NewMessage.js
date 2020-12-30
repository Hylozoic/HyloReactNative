import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import LoadingScreen from 'screens/LoadingScreen'
import Button from 'components/Button'
import MessageInput from 'components/MessageInput'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import scopedFetchPeopleAutocomplete from 'store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from 'store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from 'screens/ItemChooser/PersonPickerItemRow'
import styles from './NewMessage.styles'

export default class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.props.navigation.setParams({
      confirmLeave: this.confirmLeave
    })
    this.state = {
      viewKey: 0,
      participants: []
    }
  }

  componentDidMount () {
    this.props.fetchRecentContacts()
    this.props.initialParticipants.forEach(this.addParticipant)
  }

  onBlurMessageInput = () => {
    const { viewKey } = this.state
    this.setState({ viewKey: viewKey + 1 })
  }

  createMessage = text => {
    const { participants } = this.state
    const participantIds = participants.map(p => p.id)
    this.props.createMessage(text, participantIds)
  }

  addParticipant = participant => {
    this.updateParticipants([...this.state.participants, participant])
  }

  handleRemoveParticipant = participant => {
    const { participants } = this.state
    const updatedParticipants = participants.filter(p => p.id !== participant.id)
    this.updateParticipants(updatedParticipants)
  }

  updateParticipants = participants => {
    this.setState({ participants })
  }

  openParticipantChooser = () => {
    const { recentContacts } = this.props
    const { participants } = this.state
    const screenTitle = 'Add Participant'
    const chooserProps = {
      screenTitle,
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete,
      getSearchSuggestions: scopedGetPeopleAutocomplete(screenTitle),
      initialItems: participants,
      pickItem: this.addParticipant,
      ItemRowComponent: PersonPickerItemRow,
      defaultSuggestedItemsLabel: 'Recent Contacts',
      defaultSuggestedItems: recentContacts
    }
    this.props.navigation.navigate('ItemChooserScreen', chooserProps)
  }

  confirmLeave = (onLeave) => {
    confirmDiscardChanges({ onDiscard: onLeave })
  }

  render () {
    const {
      pending,
      mockViewKey // just for testing
    } = this.props

    if (pending) return <LoadingScreen />

    const { participants } = this.state
    const emptyParticipantsList = participants.length === 0

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardFriendlyView style={styles.container} key={mockViewKey || this.state.viewKey}>
          <ScrollView>
            <TouchableOpacity onPress={() => this.openParticipantChooser()} style={styles.participants}>
              {participants.map((participant, index) =>
                <Participant
                  participant={participant}
                  onPress={this.handleRemoveParticipant}
                  key={index}
                />)}
            </TouchableOpacity>
            <View style={styles.addParticipantButtonWrapper}>
              <Button
                text='Add Participant'
                style={styles.addParticipantButton}
                onPress={() => this.openParticipantChooser()}
              />
            </View>
          </ScrollView>
          <MessageInput
            style={styles.messageInput}
            multiline
            onSubmit={this.createMessage}
            onBlur={this.onBlurMessageInput}
            placeholder='Type your message here'
            emptyParticipants={emptyParticipantsList}
          />
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}

export function Participant ({ participant, onPress }) {
  return (
    <View style={[styles.participant]}>
      <Avatar avatarUrl={participant.avatarUrl} style={styles.personAvatar} dimension={24} />
      <Text numberOfLines={1} ellipsizeMode='tail' style={styles.participantName}>{participant.name}</Text>
      <TouchableOpacity onPress={() => { onPress(participant) }}>
        <Icon name='Ex' style={styles.participantRemoveIcon} />
      </TouchableOpacity>
    </View>
  )
}
