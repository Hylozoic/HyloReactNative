import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import
  NewMessage, { ParticipantInput, Participant, ContactList, ContactRow, MessagePrompt }
from './NewMessage'

describe('NewMessage', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const recentContacts = [{id: 1}, {id: 2}, {id: 3}]
    const allContacts = [{id: 4}, {id: 5}, {id: 6}]
    const suggestions = [{id: 7}, {id: 8}, {id: 9}]
    const participants = [{id: 10}, {id: 11}, {id: 12}]
    const currentUser = {id: 1}
    const message = 'hi mom'
    const pending = {
      all: false,
      recent: true,
      suggestions: true
    }
    const participantInputText = ''

    renderer.render(<NewMessage
      recentContacts={recentContacts}
      allContacts={allContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      participantInputText={participantInputText}
      createMessage={() => {}}
      setMessage={() => {}}
      message={message}
      pending={pending}
      />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()

    const participantInputText2 = 'Jon'

    renderer.render(<NewMessage
      recentContacts={recentContacts}
      allContacts={allContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      participantInputText={participantInputText2}
      createMessage={() => {}}
      setMessage={() => {}}
      message={message}
      pending={pending}
      />)

    const actual2 = renderer.getRenderOutput()

    expect(actual2).toMatchSnapshot()
  })

  it('calls the right functions on mount', () => {
    const props = {
      fetchContacts: jest.fn(),
      fetchRecentContacts: jest.fn(),
      loadParticipantsFromParams: jest.fn(),
      pending: {},
      participants: [],
      recentContacts: [],
      allContacts: [],
      suggestions: []
    }
    ReactTestRenderer.create(<NewMessage {...props} />).getInstance()
    expect(props.fetchContacts).toHaveBeenCalled()
    expect(props.fetchRecentContacts).toHaveBeenCalled()
    expect(props.loadParticipantsFromParams).toHaveBeenCalled()
  })
})

describe('ParticipantInput', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const participants = [{id: 10}, {id: 11}, {id: 12}]
    const text = 'Jon'

    renderer.render(<ParticipantInput
      participants={participants}
      text={text}
      onChangeText={() => {}}
      removeParticipant={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('Participant', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const participant = {
      id: 1,
      name: 'Participant One',
      avatarUrl: 'pone.png'
    }

    renderer.render(<Participant
      participant={participant}
      remove={() => {}} />)

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ContactList', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const label = 'Recent Contacts'
    const contacts = [{id: 4}, {id: 5}, {id: 6}]

    renderer.render(<ContactList
      label={label}
      contacts={contacts}
      addParticipant={() => {}}
      grayed
      loading />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ContactRow', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const contact = {
      id: 1,
      name: 'Contact One',
      avatarUrl: 'cone.png'
    }
    renderer.render(<ContactRow
      contact={contact}
      grayed
      add={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('MessagePrompt', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const currentUser = {
      id: 1,
      name: 'Contact One',
      avatarUrl: 'cone.png'
    }
    const message = 'hi mom'

    renderer.render(<MessagePrompt
      currentUser={currentUser}
      message={message}
      createMessage={() => {}}
      setMessage={() => {}}
      onBlur={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
