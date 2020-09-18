import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Projects, { CreateProjectButton } from './Projects'

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

describe('CreateProjectButton', () => {
  it('renders correctly', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      createProject: () => {}
    }
    renderer.render(<CreateProjectButton {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
