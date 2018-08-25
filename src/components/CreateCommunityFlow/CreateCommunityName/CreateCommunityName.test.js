import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateCommunityName from './CreateCommunityName'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CreateCommunityName />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('displays an error message without a community name with checkAndSubmit', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityName />)
  const instance = renderer.getInstance()
  const communityName = ''
  instance.setState({communityName})
  instance.checkAndSubmit()
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('stores the community name and redirects with a community name with checkAndSubmit', () => {
  const props = {
    saveCommunityName: jest.fn(),
    goToCreateCommunityUrl: jest.fn()
  }
  const communityName = 'communityName'
  const renderer = ReactTestRenderer.create(<CreateCommunityName {...props} />)
  const instance = renderer.getInstance()
  instance.setState({communityName})
  instance.checkAndSubmit()
  expect(props.saveCommunityName).toHaveBeenCalledWith(communityName)
  expect(props.goToCreateCommunityUrl).toHaveBeenCalled()
})

it('clears error from state with clearErrors', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityName />)
  const instance = renderer.getInstance()
  const error = 'some error'
  instance.setState({error})
  instance.clearErrors()
  expect(instance.state.error).toBeNull()
})

it('updates state with setInput', () => {
  const renderer = ReactTestRenderer.create(<CreateCommunityName />)
  const instance = renderer.getInstance()
  const key = 'key'
  const value = 'value'
  instance.setInput(key, value)
  instance.clearErrors()
  expect(instance.state[key]).toEqual(value)
})

it('sets the initial state with the initial communityName prop value', () => {
  const communityName = 'communityName'
  const props = {
    communityName
  }
  const renderer = ReactTestRenderer.create(<CreateCommunityName {...props} />)
  const instance = renderer.getInstance()
  expect(instance.state.communityName).toEqual(communityName)
})

it('has navigationOptions', () => {
  const navigation = jest.fn()
  expect(CreateCommunityName.navigationOptions(navigation)).toMatchSnapshot()
})
