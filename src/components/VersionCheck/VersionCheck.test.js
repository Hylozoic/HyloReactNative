import React from 'react'
import TestRenderer from 'react-test-renderer'
import VersionCheck from './VersionCheck'
import { View, Alert } from 'react-native'

jest.mock('react-native-device-info')
jest.mock('Linking')

const checkVersion = jest.fn(() => Promise.resolve())

describe('VersionCheck', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert')
  })

  afterEach(() => {
    Alert.alert.mockReset()
  })

  it('renders as pending by default', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const node = TestRenderer.create(
      <VersionCheck updateType={updateType} checkVersion={checkVersion}>
        <View />
      </VersionCheck>)
    expect(node).toMatchSnapshot()
  })

  it('alerts with a forced version update', async () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const node = await TestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={checkVersion}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(node).toMatchSnapshot()
    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
  })

  it('alerts with a suggested version update', async () => {
    const updateType = {
      type: 'suggest',
      title: 'Suggested update title',
      message: 'Suggested update message'
    }
    const node = await TestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={checkVersion}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(node).toMatchSnapshot()
    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
  })

  it('matches last snapshot without a version update', async () => {
    await TestRenderer.create(<VersionCheck
      checkVersion={checkVersion}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(Alert.alert).not.toBeCalled()
  })
})
