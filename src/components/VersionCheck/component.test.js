import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import VersionCheck from './component'
import { View } from 'react-native'

jest.mock('react-native-device-info')

describe('updateModal', () => {
  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('matches last snapshot with a suggested version update', () => {
    const updateType = {
      type: 'suggest'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('matches last snapshot without a version update', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={null}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})
