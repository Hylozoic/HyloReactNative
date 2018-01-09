import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CreateCommunityUrl from './CreateCommunityUrl'

jest.mock('../../KeyboardFriendlyView', () => 'KeyboardFriendlyView')
jest.mock('react-native-device-info')

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {}

  renderer.render(<CreateCommunityUrl {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
