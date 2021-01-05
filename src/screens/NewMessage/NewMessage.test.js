import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import orm from 'store/models'
import { Provider } from 'react-redux'
import { createMockStore } from 'util/testing'
import NewMessage from './NewMessage'

jest.mock('components/MessageInput', () => 'MessageInput')
jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

describe('NewMessage', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const recentContacts = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const suggestions = [{ id: 7 }, { id: 8 }, { id: 9 }]
    const participants = [{ id: 10 }, { id: 11 }, { id: 12 }]
    const currentUser = { id: 1 }
    const pending = false
    const personInputText = ''

    renderer.render(<NewMessage
      recentContacts={recentContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      initialParticipants={[]}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      personInputText={personInputText}
      createMessage={() => {}}
      navigation={{ setParams: () => {} }}
      pending={pending}
      fetchRecentContacts={() => {}}
                    />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()

    const personInputText2 = 'Jon'

    renderer.render(<NewMessage
      recentContacts={recentContacts}
      suggestions={suggestions}
      currentUser={currentUser}
      participants={participants}
      addParticipant={() => {}}
      removeParticipant={() => {}}
      setParticipantInput={() => {}}
      personInputText={personInputText2}
      createMessage={() => {}}
      navigation={{ setParams: () => {} }}
      pending={pending}
                    />)

    const actual2 = renderer.getRenderOutput()

    expect(actual2).toMatchSnapshot()
  })

  describe('onBlurMessageInput', () => {
    const props = {
      fetchRecentContacts: () => {},
      pending: {},
      participants: [],
      recentContacts: [],
      suggestions: [],
      mockViewKey: 1,
      route: {
        params: {}
      },
      navigation: {
        setParams: jest.fn(),
        getParam: jest.fn()
      }
    }
    const state = {
      orm: orm.getEmptyState(),
      queryResults: {},
      pending: {}
    }
  })
})
