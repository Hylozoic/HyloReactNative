import 'react-native'
import React from 'react'
import PopupMenuButton from './PopupMenuButton.android'
import TestRenderer from 'react-test-renderer'

it('matches the last snapshot', () => {
  const action1 = jest.fn()
  const action2 = jest.fn()
  const actions = [['Action 1', action1], ['Action 2', action2]]

  const props = {
    actions: actions.map(x => x[0]),
    onSelect: jest.fn(),
    destructiveButtonIndex: 0
  }
  const renderer = TestRenderer.create(<PopupMenuButton {...props}>
    Hello World
  </PopupMenuButton>)

  expect(renderer).toMatchSnapshot()
})

it('calls our onSelect with the right index', () => {
  const action1 = jest.fn()
  const action2 = jest.fn()
  const actions = [['Action 1', action1], ['Action 2', action2]]

  const props = {
    actions: actions.map(x => x[0]),
    onSelect: jest.fn(),
    destructiveButtonIndex: 0
  }

  const instance = TestRenderer.create(<PopupMenuButton {...props}>
    Hello World
  </PopupMenuButton>).root.instance

  instance.onSelect('itemSelected', 1)
  expect(props.onSelect).toHaveBeenCalledWith(1)
})

it('doesnt call onSelect if clicked away', () => {
  const action1 = jest.fn()
  const action2 = jest.fn()
  const actions = [['Action 1', action1], ['Action 2', action2]]

  const props = {
    actions: actions.map(x => x[0]),
    onSelect: jest.fn(),
    destructiveButtonIndex: 0
  }

  const instance = TestRenderer.create(<PopupMenuButton {...props}>
    Hello World
  </PopupMenuButton>).root.instance

  instance.onSelect('dismissed', 1)
  expect(props.onSelect).not.toHaveBeenCalled()
})

it('throws onError', () => {
  const action1 = jest.fn()
  const action2 = jest.fn()
  const actions = [['Action 1', action1], ['Action 2', action2]]

  const props = {
    actions: actions.map(x => x[0]),
    onSelect: jest.fn(),
    destructiveButtonIndex: 0
  }

  const instance = TestRenderer.create(<PopupMenuButton {...props}>
    Hello World
  </PopupMenuButton>).root.instance

  expect(() => instance.onError(new Error('anError'))).toThrow()
})
