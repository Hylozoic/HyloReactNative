import 'react-native'
import React from 'react'
import PopupMenuButtonAndroid from './PopupMenuButton.android'
import PopupMenuButtonIos from './PopupMenuButton.ios'
import TestRenderer from 'react-test-renderer'

describe('PopupMenuButton', () => {
  const platforms = [['android', PopupMenuButtonAndroid], ['ios', PopupMenuButtonIos]]

  platforms.forEach((platform) => {
    it(`${platform[0]} matches the last snapshot`, () => {
      const PopupMenuButton = platform[1]

      const action1 = jest.fn()
      const action2 = jest.fn()
      const actions = [['Action 1', action1], ['Action 2', action2]]

      const props = {
        actions: actions.map(x => x[0]),
        onSelect: jest.fn(),
        destructiveButtonIndex: 0,
        hitSlop: {top: 10},
        viewProps: {accessibilityLabel: 'A View Props Label'}
      }
      const renderer = TestRenderer.create(<PopupMenuButton {...props}>
        Hello World
      </PopupMenuButton>)

      const instance = renderer.root

      const theView = instance.findByProps({accessibilityLabel: 'A View Props Label'})

      expect(theView).toBeTruthy()

      expect(renderer).toMatchSnapshot()
    })
  })

  describe('android only', () => {
    it('calls our onSelect with the right index', () => {
      const action1 = jest.fn()
      const action2 = jest.fn()
      const actions = [['Action 1', action1], ['Action 2', action2]]

      const props = {
        actions: actions.map(x => x[0]),
        onSelect: jest.fn(),
        destructiveButtonIndex: 0
      }

      const instance = TestRenderer.create(<PopupMenuButtonAndroid {...props}>
        Hello World
      </PopupMenuButtonAndroid>).root.instance

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

      const instance = TestRenderer.create(<PopupMenuButtonAndroid {...props}>
        Hello World
      </PopupMenuButtonAndroid>).root.instance

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

      const instance = TestRenderer.create(<PopupMenuButtonAndroid {...props}>
        Hello World
      </PopupMenuButtonAndroid>).root.instance

      expect(() => instance.onError(new Error('anError'))).toThrow()
    })
  })
})
