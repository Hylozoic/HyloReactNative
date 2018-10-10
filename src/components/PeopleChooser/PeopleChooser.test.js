import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import
  PeopleChooser, { PersonInput, Person, ContactRow }
from './PeopleChooser'

jest.mock('react-native-device-info')
jest.mock('../MessageInput', () => 'MessageInput')
jest.mock('../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('PeopleChooser', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const recentContacts = [{id: 1}, {id: 2}, {id: 3}]
    const suggestions = [{id: 7}, {id: 8}, {id: 9}]
    const people = [{id: 10}, {id: 11}, {id: 12}]
    const pending = {
      all: false,
      recent: true,
      suggestions: true
    }
    const personInputText1 = ''
    const props1 = {
      peopleFromParams: [],
      suggestions,
      recentContacts,
      personInputText: personInputText1,
      updatePeople: jest.fn(),
      fetchRecentContacts: jest.fn(),
      fetchSuggestions: jest.fn(),
      pending,
      onChangeText: 'onchangetxt',
      removePerson: jest.fn(),
      text: 'inputtext',
      placeholderText: 'Testing Placeholder text',
    }
    renderer.render(<PeopleChooser {...props1} />)

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()

    const personInputText2 = 'Jon'
    const props2 = {
      peopleFromParams: people,
      suggestions,
      recentContacts,
      personInputText: personInputText2,
      updatePeople: jest.fn(),
      fetchRecentContacts: jest.fn(),
      fetchSuggestions: jest.fn(),
      pending,
      onChangeText: 'onchangetxt',
      removePerson: jest.fn(),
      text: 'inputtext',
      placeholderText: 'Testing Placeholder text'
    }

    renderer.render(<PeopleChooser {...props2} />)

    const actual2 = renderer.getRenderOutput()

    expect(actual2).toMatchSnapshot()
  })

  it('calls the right functions on mount', () => {
    const people = [{id: 10}, {id: 11}, {id: 12}]
    const props = {
      peopleFromParams: [],
      fetchRecentContacts: jest.fn()
    }
    ReactTestRenderer.create(<PeopleChooser {...props} />).getInstance()
    expect(props.fetchRecentContacts).toHaveBeenCalled()
  })
})

describe('PersonInput', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const people = [{id: 10}, {id: 11}, {id: 12}]
    const text = 'Jon'

    renderer.render(<PersonInput
      people={people}
      text={text}
      onChangeText={() => {}}
      removeParticipant={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('Person', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const person = {
      id: 1,
      name: 'Person One',
      avatarUrl: 'pone.png'
    }

    renderer.render(<Person
      person={Person}
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
