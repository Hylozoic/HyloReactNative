import React from 'react'
import { Alert } from 'react-native'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ModeratorSettings, { ModeratorRow } from './ModeratorSettings'
import ReactTestRenderer from 'react-test-renderer'

jest.mock('Alert', () => ({
  alert: jest.fn()
}))

describe('ModeratorSettings', () => {
  let props = {
    moderators: [{id: 10, name: 'John Current', avatarUrl: 'http://aurl.com'}, {id: 11, name: 'John Other', avatarUrl: 'http://aurl.com'}],
    currentUser: {id: 10},
    community: {name: 'Community Time'},
    fetchModerators: jest.fn(),
    addModerator: jest.fn(),
    moderatorSuggestions: [],
    clearModeratorSuggestions: jest.fn()
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<ModeratorSettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {}}}}
    expect(ModeratorSettings.navigationOptions(props)).toMatchSnapshot()
  })

  it('fetches molderators on update', () => {
    const props = {
      community: { slug: 'foo' },
      fetchModerators: jest.fn()
    }
    const prevPropsSameSlug = {
      community: { slug: 'foo' },
      fetchModerators: jest.fn()
    }

    const prevPropsDifferentSlug = {
      community: { slug: 'bar' },
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
      moderator: {id: 10, name: 'John Current', avatarUrl: 'http://aurl.com'},
      showMember: jest.fn(),
      removeModerator: jest.fn()
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

  it('adds moderator', () => {
    const instance = ReactTestRenderer.create(<ModeratorSettings {...props} />).getInstance()
    instance.setState({moderatorToAdd: 12, query: 'myquery', isAdding: true})

    instance.addModerator()
    expect(props.addModerator).toHaveBeenCalledWith(12)
    expect(instance.state.query).toEqual('')
    expect(instance.state.moderatorToAdd).toBeNull()
    expect(props.clearModeratorSuggestions).toHaveBeenCalled()
  })
})
