import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import JoinCommunity from './JoinCommunity'

jest.mock('../Loading', () => 'Loading')
jest.mock('react-navigation', () => ({
  navigate: () => {}
}))

const defaultRequiredProps = {
  useInvitation: () => Promise.resolve(),
  goToCommunity: () => {},
  navigation: {}
}

function testPropsSetup (props = {}, required = defaultRequiredProps) {
  return {...required, ...props}
}

function shallowRender (props) {
  const renderer = new ReactShallowRenderer()
  renderer.render(<JoinCommunity {...testPropsSetup(props)} />)
  return renderer
}

it('matches last snapshot - default', () => {
  const actual = shallowRender().getRenderOutput()
  expect(actual).toMatchSnapshot()
})

// Lifecycle Methods

test('componentWillMount', () => {
  const useInvitationResult = {

  }
  const testProps = testPropsSetup({
    useInvitation: jest.fn(() => Promise.resolve(useInvitationResult)),
    goToCommunity: jest.fn()
  })
  // const instance = ReactTestRenderer.create(<JoinCommunity {...testProps} />).getInstance()
  return shallowRender(testProps)._instance.componentWillMount()
  .then(() => {
    expect(testProps.useInvitation).toHaveBeenCalled()
    return expect(testProps.goToCommunity).toHaveBeenCalled()
  })
})
