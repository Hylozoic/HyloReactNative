import React from 'react'
import MessageInput from '../MessageInput'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
// import PeopleChooser from '../PeopleChooser'
import styles from './NewMessage.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      viewKey: 0,
      participants: []
    }
  }

  onBlurMessageInput = () => {
    const { viewKey } = this.state
    this.setState({viewKey: viewKey + 1})
  }

  createMessage = text => {
    const { participants } = this.state
    const participantIds = participants.map(p => p.id)
    this.props.createMessage(text, participantIds)
  }

  updateParticipants = participants => {
    this.setState({
      participants
    })
  }

  render () {
    const {
      mockViewKey // just for testing
    } = this.props

    const { participants } = this.state
    const emptyParticipantsList = participants.length === 0

    return <KeyboardFriendlyView
      style={styles.container}
      {...{...kavProps, behavior: 'height'}}
      key={mockViewKey || this.state.viewKey}>
      {/* <ItemChooser
        horizontal
        showRecentContacts
        updateItems={this.updateParticipants} 
        {...this.props} */}
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
