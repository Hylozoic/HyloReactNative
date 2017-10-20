import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import LoadingModal from './LoadingModal'

jest.mock('react-native-device-info')

it('returns null when display is false', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<LoadingModal />)
  const actual = renderer.getRenderOutput()

  expect(actual).toEqual(null)
})

it('matches last snapshot when display is true', () => {
  const renderer = new ReactShallowRenderer()

  renderer.render(<LoadingModal display />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
