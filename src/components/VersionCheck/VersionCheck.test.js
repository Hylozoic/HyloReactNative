import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import VersionCheck from './VersionCheck'
import { View, Alert } from 'react-native'

jest.mock('react-native-device-info')
jest.mock('Linking')

describe('VersionCheck', () => {
  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('matches last snapshot with a suggested version update', () => {
    const updateType = {
      type: 'suggest',
      title: 'Suggested title',
      message: 'Suggested message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('matches last snapshot without a version update', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={null}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  it('renders as pending by default', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<VersionCheck updateType={updateType} checkVersion={jest.fn()}>
      <View />
    </VersionCheck>)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })
})

describe('VersionCheck alert', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert')
  })

  afterEach(() => {
    Alert.alert.mockReset()
  })

  it('matches last snapshot with a forced version update', () => {
    const updateType = {
      type: 'force',
      title: 'Force title',
      message: 'Force message'
    }
    ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
  })

  it('matches last snapshot with a suggested version update', () => {
    const updateType = {
      type: 'suggest',
      title: 'Suggested update title',
      message: 'Suggested update message'
    }
    ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(Alert.alert).toHaveBeenCalled()
    expect(Alert.alert.mock.calls).toMatchSnapshot()
  })

  it('matches last snapshot without a version update', () => {
    const updateType = null
    ReactTestRenderer.create(<VersionCheck
      updateType={updateType}
      checkVersion={jest.fn()}
      pending={false}>
      <View />
    </VersionCheck>)

    expect(Alert.alert.mock.calls).toMatchSnapshot()
  })
})
