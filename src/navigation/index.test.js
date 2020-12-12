import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import RootNavigator from './index'

jest.mock('react-native-zss-rich-text-editor')

it('matches snapshot', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<RootNavigator uriPrefix='lala' />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
