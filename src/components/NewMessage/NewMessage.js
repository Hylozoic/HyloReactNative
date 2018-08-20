import React from 'react'
import MessageInput from '../MessageInput'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import PersonPicker from '../PersonPicker'
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

  render () {
    const {
      createMessage,
      mockViewKey // just for testing
    } = this.props

    const { participants } = this.state
    const emptyParticipantsList = participants.length === 0

    return <KeyboardFriendlyView
      style={styles.container}
      {...{...kavProps, behavior: 'height'}}
      key={mockViewKey || this.state.viewKey}>
      <PersonPicker updatePeople={updated => console.log('updatedPeople', updated)} {...this.props} />
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
