import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import DrawerMenu, { CommunityRow, TextButton } from './DrawerMenu'

jest.mock('react-native-device-info')

describe('DrawerMenu', () => {
  const minProps = {
    name: 'Roy Rogers',
    avatarUrl: 'http://anyurl',
    memberships: [],
    selectCommunity: () => {},
    goToMyProfile: () => {},
    showSettings: () => {}
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<DrawerMenu {...minProps} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
  })

  describe('componentDidMount', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<DrawerMenu {...minProps} />)
    const instance = renderer._instance
    instance.setState = jest.fn()
    instance.componentDidMount()
    expect(instance.setState).toHaveBeenCalledTimes(1)
  })

  describe('resetToTop', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<DrawerMenu {...minProps} />)
    const instance = renderer._instance
    instance.listView = {
      scrollTo: jest.fn()
    }
    instance.resetToTop()
    expect(instance.listView.scrollTo).toHaveBeenCalledTimes(2)
  })
})

describe('CommunityRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const community = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom'
    }
    renderer.render(<CommunityRow
      community={community}
      onPress={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('TextButton', () => {
  const renderer = new ReactShallowRenderer()
  renderer.render(<TextButton text='anything' onPress={() => {}} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
