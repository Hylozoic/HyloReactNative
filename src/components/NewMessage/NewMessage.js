import React from 'react'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native'
import Avatar from '../Avatar'
import Icon from '../Icon'
import { keyboardAvoidingViewProps as kavProps } from '../../util/viewHelpers'
import header from 'util/header'
import confirmDiscardChanges from '../../util/confirmDiscardChanges'
import { LoadingScreen } from '../Loading'
import Button from '../Button'
import MessageInput from '../MessageInput'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import scopedFetchPeopleAutocomplete from '../../store/actions/scopedFetchPeopleAutocomplete'
import scopedGetPeopleAutocomplete from '../../store/selectors/scopedGetPeopleAutocomplete'
import PersonPickerItemRow from '../ItemChooser/PersonPickerItemRow'
import styles from './NewMessage.styles'

export default class NewMessage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const confirmLeave = navigation.getParam('confirmLeave', () => {})
    return header(navigation, {
      headerBackButton: () => confirmLeave(navigation.goBack),
      title: 'New Message'
    })
  }

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

  UNSAFE_componentWillMount () {
    this.props.fetchRecentContacts()
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
    this.updateParticipants([ ...this.state.participants, participant ])
  }

  removeParticipant = participant => {
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
    const chooserProps = {
      screenTitle: 'Add Participant',
      fetchSearchSuggestions: scopedFetchPeopleAutocomplete('NewMessage'),
      getSearchSuggestions: scopedGetPeopleAutocomplete('NewMessage'),
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

    return <KeyboardFriendlyView
      style={styles.container}
      {...{...kavProps, behavior: 'padding'}} // is the default
      key={mockViewKey || this.state.viewKey}>
      <ScrollView>
        <TouchableOpacity onPress={() => this.openParticipantChooser()} style={styles.participants}>
          {participants.map((participant, index) =>
            <Participant
              participant={participant}
              onPress={this.removeParticipant}
              key={index} />)}
        </TouchableOpacity>
        <View style={styles.addParticipantButtonWrapper}>
          <Button style={styles.addParticipantButton} onPress={() => this.openParticipantChooser()}>
            Add Participant
          </Button>
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
  }
}

export function Participant ({ participant, onPress }) {
  return <View style={[styles.participant]}>
    <Avatar avatarUrl={participant.avatarUrl} style={styles.personAvatar} dimension={24} />
    <Text numberOfLines={1} ellipsizeMode='tail' style={styles.participantName}>{participant.name}</Text>
    <TouchableOpacity onPress={() => { onPress(participant) }}>
      <Icon name='Ex' style={styles.participantRemoveIcon} />
    </TouchableOpacity>
  </View>
}
