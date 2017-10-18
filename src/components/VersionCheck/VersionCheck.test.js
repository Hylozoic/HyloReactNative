import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import VersionCheck from './VersionCheck'
import { View, Alert } from 'react-native'

jest.mock('react-native-device-info')
describe('VersionCheck', () => {
  it('renders correctly without an update', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>)
    renderer._instance.showAlert(updateType)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('renders correctly with an updateType', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('matches last snapshot with a suggested version update', () => {
    const updateType = {
      type: 'suggest'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('matches last snapshot without a version update', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={null} checkVersion={jest.fn()}><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
  it('renders correctly while pending', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()} pending><View /></VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('VersionCheck alert', () => {
  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const origAlert = Alert.alert
    Alert.alert = jest.fn()
    const instance = ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
    >
      <View />
    </VersionCheck>).getInstance()

    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
    Alert.alert = origAlert
  })

  it('matches last snapshot with a suggested version update', () => {
    const updateType = {
      type: 'suggested',
      title: 'Suggested update title',
      message: 'Suggested update message'
    }
    const origAlert = Alert.alert
    Alert.alert = jest.fn()
    const instance = ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
    >
      <View />
    </VersionCheck>).getInstance()

    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
    Alert.alert = origAlert
  })

  it('matches last snapshot without a version update', () => {
    const updateType = null
    const origAlert = Alert.alert
    Alert.alert = jest.fn()
    const instance = ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
    >
      <View />
    </VersionCheck>).getInstance()

    expect(Alert.alert.mock.calls).toMatchSnapshot()
    Alert.alert = origAlert
  })
})
