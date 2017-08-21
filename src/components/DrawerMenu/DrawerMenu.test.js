import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import DrawerMenu, { CommunityRow } from './DrawerMenu'

describe('DrawerMenu', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const currentUser = {
      name: 'Roy Rogers'
    }
    renderer.render(<DrawerMenu
      currentUser={currentUser}
      changeCommunity={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
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

  it('shows all community link', () => {
    const renderer = new ReactShallowRenderer()
    const community = {id: 'all', name: 'All Communities'}
    renderer.render(<CommunityRow
      community={community}
      onPress={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
