import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import CreateGroupName from './CreateGroupName'

jest.mock('components/KeyboardFriendlyView', () => 'KeyboardFriendlyView')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<CreateGroupName />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('displays an error message without a group name with checkAndSubmit', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupName />)
  const instance = renderer.getInstance()
  const groupName = ''
  instance.setState({ groupName })
  instance.checkAndSubmit()
  expect(renderer.toJSON()).toMatchSnapshot()
})

it('stores the group name and redirects with a group name with checkAndSubmit', () => {
  const props = {
    updateGroupData: jest.fn(),
    goToNextStep: jest.fn()
  }
  const groupName = 'groupName'
  const renderer = ReactTestRenderer.create(<CreateGroupName {...props} />)
  const instance = renderer.getInstance()
  instance.setState({ groupName })
  instance.checkAndSubmit()
  expect(props.updateGroupData).toHaveBeenCalledWith({ name: groupName })
  expect(props.goToNextStep).toHaveBeenCalled()
})

it('clears error from state with clearErrors', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupName />)
  const instance = renderer.getInstance()
  const error = 'some error'
  instance.setState({ error })
  instance.clearErrors()
  expect(instance.state.error).toBeNull()
})

it('updates state with setInput', () => {
  const renderer = ReactTestRenderer.create(<CreateGroupName />)
  const instance = renderer.getInstance()
  const key = 'key'
  const value = 'value'
  instance.setInput(key, value)
  instance.clearErrors()
  expect(instance.state[key]).toEqual(value)
})

it('sets the initial state with the initial groupName prop value', () => {
  const groupName = 'groupName'
  const props = {
    groupName
  }
  const renderer = ReactTestRenderer.create(<CreateGroupName {...props} />)
  const instance = renderer.getInstance()
  expect(instance.state.groupName).toEqual(groupName)
})
