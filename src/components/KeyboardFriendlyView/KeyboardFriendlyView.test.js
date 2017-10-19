import {Text} from 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import KeyboardFriendlyViewiOS from './KeyboardFriendlyView.ios'
import KeyboardFriendlyViewAndroid from './KeyboardFriendlyView.android'

jest.mock('react-native-device-info')

describe('KeyboardFriendlyViewiOS', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<KeyboardFriendlyViewiOS
      behavior={'padding'}
      testID={'123'}>
      <Text>Children</Text>
    </KeyboardFriendlyViewiOS>)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('KeyboardFriendlyViewAndroid', () => {
  it('matches last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<KeyboardFriendlyViewAndroid
      behavior={'padding'}
      testID={'123'}>
      <Text>Children</Text>
    </KeyboardFriendlyViewAndroid>)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
