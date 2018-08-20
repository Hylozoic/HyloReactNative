import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import
  PersonPicker, { ParticipantInput, Participant, ContactRow }
from './PersonPicker'

jest.mock('react-native-device-info')
jest.mock('../MessageInput', () => 'MessageInput')
jest.mock('../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('PersonPicker', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const recentContacts = [{id: 1}, {id: 2}, {id: 3}]
    const suggestions = [{id: 7}, {id: 8}, {id: 9}]
    const participants = [{id: 10}, {id: 11}, {id: 12}]
    const currentUser = {id: 1}
    const pending = {
      all: false,
      recent: true,
      suggestions: true
    }
    const participantInputText = ''

    renderer.render(<PersonPicker
      recentContacts={recentContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      participantInputText={participantInputText}
      createMessage={() => {}}
      pending={pending}
      />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()

    const participantInputText2 = 'Jon'

    renderer.render(<PersonPicker
      recentContacts={recentContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      participantInputText={participantInputText2}
      createMessage={() => {}}
      pending={pending}
      />)

    const actual2 = renderer.getRenderOutput()

    expect(actual2).toMatchSnapshot()
  })

  it('calls the right functions on mount', () => {
    const props = {
      fetchRecentContacts: jest.fn(),
      loadParticipantsFromParams: jest.fn(),
      pending: {},
      participants: [],
      recentContacts: [],
      suggestions: []
    }
    ReactTestRenderer.create(<PersonPicker {...props} />).getInstance()
    expect(props.fetchRecentContacts).toHaveBeenCalled()
    expect(props.loadParticipantsFromParams).toHaveBeenCalled()
  })

  describe('onBlurMessageInput', () => {
    const props = {
      fetchRecentContacts: () => {},
      loadParticipantsFromParams: () => {},
      pending: {},
      participants: [],
      recentContacts: [],
      suggestions: [],
      mockViewKey: 1
    }
    it('increments the view key', () => {
      const instance = ReactTestRenderer.create(<PersonPicker {...props} />).getInstance()
      instance.setState({viewKey: 2})
      instance.onBlurMessageInput()
      expect(instance.state.viewKey).toEqual(3)
    })
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
