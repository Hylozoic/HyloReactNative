import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberList from './MemberList'

describe('MemberList', () => {
  it('renders with default props with default non-server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      members: [
        {id: '1', name: 'Loren'},
        {id: '2', name: 'Robbie'}
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  // it('renders new list of members if provided members list changes', () => {
  //   const props = {
  //     members: [
  //       {id: '1', name: 'Loren'},
  //       {id: '2', name: 'Robbie'}
  //     ]
  //   }

  //   const renderer = ReactTestRenderer.create(
  //     <MemberList {...props} />

  //   )

  //   const instance = renderer.getInstance()
  //   console.log('!!! initially', instance.state)

  //   const updatedProps = {
  //     members: [
  //       {id: '1', name: 'Loren Johnson'}
  //     ]
  //   }

  //   // How to test this method?
  //   instance.componentDidUpdate(updatedProps)
  //   console.log('!!! after', instance)
  // })

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


  it('runs call for new results if server search', () => {
    const renderer = new ReactShallowRenderer()
    const testProps = {
      isServerSearch: true,
      members: [
        {id: '1', name: 'Loren'},
        {id: '2', name: 'Robbie'}
      ]
    }

    renderer.render(
      <MemberList {...testProps} />
    )

    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
