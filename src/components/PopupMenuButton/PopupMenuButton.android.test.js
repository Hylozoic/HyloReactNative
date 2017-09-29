import 'react-native'
import React from 'react'
import PopupMenuButton from './PopupMenuButton.android'
import TestRenderer from 'react-test-renderer'
import { TouchableOpacity } from 'react-native'

it('matches the last snapshot', () => {
  const onSelect = jest.fn()
  const action1 = jest.fn()
  const action2 = jest.fn()

  const renderer = TestRenderer.create(<PopupMenuButton actions={[['Action 1', action1], ['Action 2', action2]]} onSelect={onSelect}
  destructiveButtonIndex={0}>
    Hello World
  </PopupMenuButton>)

  expect(renderer).toMatchSnapshot()
})
