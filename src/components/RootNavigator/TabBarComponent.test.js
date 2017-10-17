import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TestRenderer from 'react-test-renderer'
import TabBarComponent from './TabBarComponent'
import { Keyboard } from 'react-native'

it('renders correctly', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<TabBarComponent />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})

it('manages keyboard correctly', () => {
  const remove = jest.fn()
  const addListenerSpy = jest.spyOn(Keyboard, 'addListener').mockImplementation(() => ({
    remove
  }))

  const navigation = {state: {
    routes: []
  }}
  const renderer = TestRenderer.create(<TabBarComponent navigation={navigation} />)

  const instance = renderer.root.instance

  expect(instance.state.isVisible).toBeTruthy()

  expect(addListenerSpy).toHaveBeenCalledTimes(2)

  instance.keyboardWillShow()
  expect(instance.state.isVisible).toBeFalsy()

  instance.keyboardWillHide()
  expect(instance.state.isVisible).toBeTruthy()

  renderer.unmount()
  expect(remove).toHaveBeenCalledTimes(2)

  addListenerSpy.mockReset()
  addListenerSpy.mockRestore()
})
