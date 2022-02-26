import React from 'react'
import { Alert } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { ModeratorSettings, ModeratorRow } from './ModeratorSettings'
import ReactTestRenderer from 'react-test-renderer'

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn()
}))

describe('ModeratorSettings', () => {
  const props = {
    moderators: [{ id: 10, name: 'John Current', avatarUrl: 'http://aurl.com' }, { id: 11, name: 'John Other', avatarUrl: 'http://aurl.com' }],
    currentUser: { id: 10 },
    group: { name: 'Group Time' },
    fetchModerators: jest.fn(),
    addModerator: jest.fn(),
    moderatorSuggestions: [],
    fetchModeratorSuggestions: jest.fn(),
    clearModeratorSuggestions: jest.fn()
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<ModeratorSettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('fetches molderators on update', () => {
    const props = {
      group: { slug: 'foo' },
      fetchModerators: jest.fn()
    }
    const prevPropsSameSlug = {
      group: { slug: 'foo' },
      fetchModerators: jest.fn()
    }

    const prevPropsDifferentSlug = {
      group: { slug: 'bar' },
      fetchModerators: jest.fn()
    }

    const instance = ReactTestRenderer.create(<ModeratorSettings {...props} />).getInstance()

    expect(props.fetchModerators).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsSameSlug)
    expect(props.fetchModerators).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentSlug)
    expect(props.fetchModerators).toHaveBeenCalledTimes(2)
  })

  it('renders ModeratorRow', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      moderator: { id: 10, name: 'John Current', avatarUrl: 'http://aurl.com' },
      showMember: jest.fn(),
      removeModerator: jest.fn()
    }
    renderer.render(<ModeratorRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders ModeratorRow without removeModerator', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      moderator: { id: 10, name: 'John Current', avatarUrl: 'http://aurl.com' },
      showMember: jest.fn(),
      removeModerator: null
    }
    renderer.render(<ModeratorRow {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('sends alert when removing moderator', () => {
    const instance = ReactTestRenderer.create(<ModeratorSettings {...props} />).getInstance()

    instance.removeModerator(10)
    expect(Alert.alert).toHaveBeenCalled()
  })

  it('addModerator', () => {
    const instance = ReactTestRenderer.create(<ModeratorSettings {...props} />).getInstance()
    const moderatorId = 12
    instance.addModerator({ id: moderatorId })
    expect(props.addModerator).toHaveBeenCalledWith(moderatorId)
  })

  it('shows the Search component appropriately', () => {
    const renderer = ReactTestRenderer.create(<ModeratorSettings {...props} />)
    const instance = renderer.getInstance()
    instance.setState({
      showPicker: true
    })
    expect(renderer.toJSON()).toMatchSnapshot()
  })
})
