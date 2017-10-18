import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import VersionCheck from './VersionCheck'
import { View, Alert } from 'react-native'

jest.mock('react-native-device-info')

describe('VersionCheck alert', () => {
  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force'
    }
    const origAlert = Alert.alert
    Alert.alert = jest.fn()
    const instance = ReactTestRenderer.create(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>).getInstance()

    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
    Alert.alert = origAlert
  })
  // it('matches last snapshot with a suggested version update', () => {
  //   const updateType = {
  //     type: 'suggest'
  //   }
  //   const renderer = new ReactShallowRenderer()
  //   renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>)
  //   const actual = renderer.getRenderOutput()
  //   expect(actual).toMatchSnapshot()
  // })
  // it('matches last snapshot without a version update', () => {
  //   const renderer = new ReactShallowRenderer()
  //   renderer.render(<VersionCheck updateType={null} checkVersion={jest.fn()}><View /></VersionCheck>)
  //   const actual = renderer.getRenderOutput()
  //   expect(actual).toMatchSnapshot()
  // })
})
