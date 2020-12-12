import { TextInput } from 'react-native'
import React from 'react'

import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import { simulate } from 'util/testing'
import MemberList from './MemberList'

const lodash = jest.requireActual('lodash/fp')
lodash.debounce = (_, fn) => fn

describe('MemberList', () => {
  it('renders with default props with default non-server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      members: [
        { id: '1', name: 'Loren' },
        { id: '2', name: 'Robbie' }
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('sets new list members if provided members list changes', () => {
    const props = {
      members: [
        { id: '1', name: 'Member 1' },
        { id: '2', name: 'Member 2' }
      ]
    }
    const prevProps = {
      members: [
        { id: '1', name: 'Member1' },
        { id: '2', name: 'Member 2' }
      ]
    }
    const instance = ReactTestRenderer.create(
      <MemberList {...props} />
    ).getInstance()

    instance.setState = jest.fn()
    instance.componentDidUpdate(props)
    expect(instance.setState).not.toHaveBeenCalled()
    instance.setState = jest.fn()
    instance.componentDidUpdate(prevProps)
    expect(instance.setState).toHaveBeenCalledWith(props)
  })

  it('runs search when typing', () => {
    const props = {
      members: [
        { id: '1', name: 'asdf' },
        { id: '2', name: 'hjkl' }
      ]
    }
    const renderer = ReactTestRenderer.create(
      <MemberList {...props} />
    )
    const searchField = renderer.root.findByType(TextInput)
    const instance = renderer.getInstance()
    const searchText = 'hj'

    instance.setState = jest.fn()
    simulate(searchField, 'changeText', searchText)
    expect(instance.setState).toHaveBeenCalledWith({
      members: [props.members[1]]
    })
  })

  describe('server search', () => {
    it('fetches new results when search provided', () => {
      const testProps = {
        isServerSearch: true,
        search: 'test',
        fetchMembers: jest.fn()
      }
      const renderer = ReactTestRenderer.create(
        <MemberList {...testProps} />
      )

      expect(testProps.fetchMembers).toHaveBeenCalled()
      expect(renderer).toMatchSnapshot()
    })
  })

  it('sets search when typing', () => {
    const props = {
      isServerSearch: true,
      setSearch: jest.fn()
    }
    const renderer = ReactTestRenderer.create(
      <MemberList {...props} />
    )
    const searchField = renderer.root.findByType(TextInput)
    const searchText = 'hj'

    simulate(searchField, 'changeText', searchText)
    expect(props.setSearch).toHaveBeenCalledWith(searchText)
  })

  it('runs call for new results if server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      isServerSearch: true,
      members: [
        { id: '1', name: 'Loren' },
        { id: '2', name: 'Robbie' }
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
