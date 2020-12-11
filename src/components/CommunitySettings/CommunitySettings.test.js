import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommunitySettings, { CommunityBanner, EditButton } from './CommunitySettings'
import ReactTestRenderer from 'react-test-renderer'
import ImagePicker from '../ImagePicker'
import defaultBanner from '../../assets/default-user-banner.jpg'
import Toast from 'react-native-root-toast'

jest.mock('../ImagePicker', props => 'ImagePicker')

describe('CommunitySettings', () => {
  let props = {
    communityId: 10,
    community: {
      id: 10,
      name: 'Community Time',
      description: 'some description',
      avatarUrl: 'someAvatarUrl.com',
      bannerUrl: 'someBannerUrl.com'
    },
    navigation: {
      setParams: jest.fn(),
      state: {params: {}},
      getParam: jest.fn()
    },
    isFocused: true,
    fetchCommunitySettings: jest.fn(),
    updateCommunitySettings: jest.fn(() => Promise.resolve({}))
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<CommunitySettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('fetches settings on update', () => {
    const prevPropsSameId = {
      communityId: 10,
      community: {
        id: 10
      }
    }

    const prevPropsDifferentId = {
      communityId: 20,
      community: {
        id: 20
      }
    }

    const instance = ReactTestRenderer.create(<CommunitySettings {...props} />).getInstance()
    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsSameId)
    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentId)
    expect(props.fetchCommunitySettings).toHaveBeenCalledTimes(2)
  })

  it('syncs fields on update', () => {
    const prevPropsSameId = {
      communityId: 10,
      community: {
        id: 10,
        name: 'New Community Name',
        description: 'some description',
        avatarUrl: 'someAvatarUrl.com',
        bannerUrl: 'someBannerUrl.com'
      }
    }

    const prevPropsDifferentId = {
      communityId: 20,
      community: {
        id: 20,
        name: 'Other New Community Name',
        description: 'some description',
        avatarUrl: 'someAvatarUrl.com',
        bannerUrl: 'someBannerUrl.com'
      }
    }

    const instance = ReactTestRenderer.create(<CommunitySettings {...props} />).getInstance()
    jest.spyOn(instance, 'syncLocalFields')
    expect(instance.syncLocalFields).not.toHaveBeenCalled()
    instance.componentDidUpdate(prevPropsSameId)
    expect(instance.syncLocalFields).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentId)
    expect(instance.syncLocalFields).toHaveBeenCalledTimes(2)
  })

  it('syncs fields on update', () => {
    const instance = ReactTestRenderer.create(<CommunitySettings {...props} />).getInstance()
    jest.spyOn(Toast, 'show')
    return instance.saveChanges()
      .then((response) => {
        const edits = {
          name: props.community.name,
          description: props.community.description,
          location: props.community.location
        }
        expect(props.updateCommunitySettings).toHaveBeenLastCalledWith(edits)
        expect(Toast.show).toHaveBeenCalled()
        expect(instance.state.changed).toBeFalsy()
      })
  })

  it('shows error toast when updates failed', () => {
    props.updateCommunitySettings = jest.fn(() => Promise.resolve({error: true}))
    const instance = ReactTestRenderer.create(<CommunitySettings {...props} />).getInstance()
    jest.spyOn(Toast, 'show')
    instance.setState({changed: true})
    return instance.saveChanges()
      .then((response) => {
        expect(Toast.show).toHaveBeenCalled()
        expect(instance.state.changed).toBeTruthy()
      })
  })

  describe('CommunityBanner', () => {
    let props

    beforeEach(() => {
      props = {
        community: {
          id: 1,
          bannerUrl: 'yay.png',
          avatarUrl: 'pong.png'
        }
      }
    })

    it('matches the last snapshot', () => {
      const renderer = new ReactShallowRenderer()
      renderer.render(<CommunityBanner {...props} />)
      const actual = renderer.getRenderOutput()

      expect(actual).toMatchSnapshot()
    })

    it('shows local images if present', () => {
      const instance = ReactTestRenderer.create(<CommunityBanner {...props} />).getInstance()
      instance.setState({
        bannerLocalUri: 'bannerlocal.png',
        avatarLocalUri: 'avatarlocal.jpg'
      })

      expect(instance.toJSON).toMatchSnapshot()
    })

    it('populates onChoice and onPendingChange of second ImagePicker', () => {
      const node = ReactTestRenderer.create(<CommunityBanner {...props} />)
      const instance = node.getInstance()
      instance.onChoice = jest.fn()
      const secondPicker = node.root.findAllByType(ImagePicker)[1]
      secondPicker.props.onChoice()
      expect(instance.onChoice).toHaveBeenCalled()
      secondPicker.props.onPendingChange(true)
      expect(instance.state.avatarPickerPending).toEqual(true)
    })

    describe('onChoice', () => {
      const props = {
        community: {
          id: 1
        },
        updateCommunitySettings: jest.fn()
      }
      const local = 'local.uri'
      const remote = 'remote.uri'
      const instance = ReactTestRenderer.create(<CommunityBanner {...props} />).getInstance()
      instance.onChoice({local, remote}, 'banner')
      expect(instance.state.bannerLocalUri).toEqual(local)
      expect(props.updateCommunitySettings).toHaveBeenCalledWith({bannerUrl: remote})
    })

    it('shows a default banner if community has not set one', () => {
      props.community.bannerUrl = null
      const { root } = ReactTestRenderer.create(<CommunityBanner {...props} />)
      const images = root.findAllByProps({ source: defaultBanner })

      // react-native's mockComponent.js causes some issues here by placing
      // child props on the parent. This means that the above will actually
      // find two components in the tree, not one. Hence we only check for a
      // non-zero length. https://github.com/facebook/react-native/issues/16281
      expect(images.length).not.toBe(0)
    })

    it('does not show a default banner if a local one has been set', () => {
      // Covers the case where community doesn't have a banner, but is trying to add
      // one through the client.
      props.community.bannerUrl = null
      const renderer = ReactTestRenderer.create(<CommunityBanner {...props} />)
      renderer.getInstance().setState({ bannerLocalUri: 'flargle.jpg' })
      const images = renderer.root.findAllByProps({ source: defaultBanner })
      expect(images.length).toBe(0)
    })

    it('shows edit buttons', () => {
      const { root } = ReactTestRenderer.create(<CommunityBanner {...props} />)
      expect(root.findAllByType(EditButton).length).toBe(2)
    })
  })
})
