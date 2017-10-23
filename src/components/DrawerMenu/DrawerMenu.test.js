import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import DrawerMenu, { SectionHeader, NetworkRow, CommunityRow, TextButton } from './DrawerMenu'
import { ALL_COMMUNITIES_ID } from '../../store/models/Community'

jest.mock('react-native-device-info')

describe('DrawerMenu', () => {
  const minProps = {
    name: 'Roy Rogers',
    avatarUrl: 'http://anyurl',
    memberships: [],
    goToCommunity: () => {},
    goToMyProfile: () => {},
    showSettings: () => {},
    currentCommunityId: 12,
    networks: [],
    communities: []
  }

  it('matches the last snapshot', () => {
    const props = {
      networks: [{
        id: 1,
        name: 'Network'
      }],
      communities: [{
        id: 2,
        name: 'Community'
      }]
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<DrawerMenu {...minProps} {...props} />)
    const actual = renderer.getRenderOutput()
    expect(actual).toMatchSnapshot()
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

describe('SectionHeader', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<SectionHeader section={{label: 'Networked Communities'}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('NetworkRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const network = {
      id: 1,
      avatarUrl: 'network.png',
      name: 'Network Name',
      communities: [{
        id: 1,
        avatarUrl: 'foo.png',
        name: 'Foom',
        newPostCount: 1
      }]
    }
    renderer.render(<NetworkRow
      network={network}
      goToCommunity={() => {}}
      currentCommunityId={1} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('shows all communities link', () => {
    const renderer = new ReactShallowRenderer()
    const network = {
      id: ALL_COMMUNITIES_ID,
      name: 'All Communities',
      communities: []
    }
    renderer.render(<NetworkRow
      network={network}
      goToCommunity={() => {}}
      currentCommunityId={1} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('sets expanded to false when no new posts in communities', () => {
    const props = {
      network: {
        name: '',
        avatarUrl: '',
        communities: [
          {id: 1, newPostCount: 0},
          {id: 2, newPostCount: 0}
        ]
      }
    }
    const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
    expect(instance.state.expanded).toEqual(false)
  })

  it('sets expanded to true when there are new posts in communities', () => {
    const props = {
      network: {
        name: '',
        avatarUrl: '',
        communities: [
          {id: 1, newPostCount: 1},
          {id: 2, newPostCount: 0}
        ]
      }
    }
    const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
    expect(instance.state.expanded).toEqual(true)
  })

  describe('toggleExpanded', () => {
    const props = {
      network: {
        name: '',
        avatarUrl: '',
        communities: []
      }
    }
    it('toggles expanded state', () => {
      const instance = ReactTestRenderer.create(<NetworkRow {...props} />).getInstance()
      instance.toggleExpanded()
      expect(instance.state.expanded).toEqual(true)
      instance.toggleExpanded()
      expect(instance.state.expanded).toEqual(false)
    })
  })
})

describe('CommunityRow', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const community = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom',
      newPostCount: 7
    }
    renderer.render(<CommunityRow
      community={community}
      goToCommunity={() => {}}
      currentCommunityId={2} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('hides badge when no newPostCount', () => {
    const renderer = new ReactShallowRenderer()
    const community = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom'
    }
    renderer.render(<CommunityRow
      community={community}
      goToCommunity={() => {}}
      currentCommunityId={2} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('highlights when matching currentCommunityId', () => {
    const renderer = new ReactShallowRenderer()
    const community = {
      id: 1,
      avatarUrl: 'foo.png',
      name: 'Foom'
    }
    renderer.render(<CommunityRow
      community={community}
      goToCommunity={() => {}}
      currentCommunityId={community.id} />)
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
