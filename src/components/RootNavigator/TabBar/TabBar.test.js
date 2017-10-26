import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import TabBar from './TabBar'
import { Keyboard } from 'react-native'

jest.mock('util/platform', () => ({
  isIOS: false
}))

it('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<TabBar isVisible />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('manages keyboard correctly', () => {
  const remove = jest.fn()
  jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({
    remove
  }))

  const navigation = {state: {
    routes: []
  }}
  const renderer = TestRenderer.create(<TabBar navigation={navigation} />)

  const instance = renderer.root.instance

  expect(instance.state.isVisible).toBeTruthy()

  expect(Keyboard.addListener).toHaveBeenCalledTimes(2)

  instance.keyboardWillShow()
  expect(instance.state.isVisible).toBeFalsy()

  instance.keyboardWillHide()
  expect(instance.state.isVisible).toBeTruthy()

  renderer.unmount()
  expect(remove).toHaveBeenCalledTimes(2)

  Keyboard.addListener.mockReset()
  Keyboard.addListener.mockRestore()
})
