import 'react-native'
import React from 'react'
import ReactTestRenderer from 'react-test-renderer'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Projects from './Projects'

jest.mock('react-native-device-info')

describe('Projects', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      currentUser: {},
      networkId: 1
    }
    renderer.render(<Projects {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('renders Loading without a user', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      networkId: 1
    }
    renderer.render(<Projects {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
