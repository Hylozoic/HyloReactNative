import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import { GroupSettings, GroupBanner, EditButton } from './GroupSettings'
import ReactTestRenderer from 'react-test-renderer'
import ImagePicker from 'components/ImagePicker'
import defaultBanner from 'assets/default-user-banner.jpg'
import Toast from 'react-native-root-toast'

jest.mock('components/ImagePicker', props => 'ImagePicker')

describe('GroupSettings', () => {
  const props = {
    groupId: 10,
    group: {
      id: 10,
      name: 'Group Time',
      description: 'some description',
      avatarUrl: 'someAvatarUrl.com',
      bannerUrl: 'someBannerUrl.com'
    },
    route: {
      params: {}
    },
    navigation: {
      setOptions: jest.fn()
    },
    isFocused: true,
    fetchGroupSettings: jest.fn(),
    updateGroupSettings: jest.fn(() => Promise.resolve({}))
  }

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()

    renderer.render(<GroupSettings {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('fetches settings on update', () => {
    const prevPropsSameId = {
      groupId: 10,
      group: {
        id: 10
      }
    }

    const prevPropsDifferentId = {
      groupId: 20,
      group: {
        id: 20
      }
    }

    const instance = ReactTestRenderer.create(<GroupSettings {...props} />).getInstance()
    expect(props.fetchGroupSettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsSameId)
    expect(props.fetchGroupSettings).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentId)
    expect(props.fetchGroupSettings).toHaveBeenCalledTimes(2)
  })

  it('syncs fields on update', () => {
    const prevPropsSameId = {
      groupId: 10,
      group: {
        id: 10,
        name: 'New Group Name',
        description: 'some description',
        avatarUrl: 'someAvatarUrl.com',
        bannerUrl: 'someBannerUrl.com'
      }
    }

    const prevPropsDifferentId = {
      groupId: 20,
      group: {
        id: 20,
        name: 'Other New Group Name',
        description: 'some description',
        avatarUrl: 'someAvatarUrl.com',
        bannerUrl: 'someBannerUrl.com'
      }
    }

    const instance = ReactTestRenderer.create(<GroupSettings {...props} />).getInstance()
    jest.spyOn(instance, 'syncLocalFields')
    expect(instance.syncLocalFields).not.toHaveBeenCalled()
    instance.componentDidUpdate(prevPropsSameId)
    expect(instance.syncLocalFields).toHaveBeenCalledTimes(1)
    instance.componentDidUpdate(prevPropsDifferentId)
    expect(instance.syncLocalFields).toHaveBeenCalledTimes(2)
  })

  it('syncs fields on update', () => {
    const instance = ReactTestRenderer.create(<GroupSettings {...props} />).getInstance()
    jest.spyOn(Toast, 'show')
    return instance.saveChanges()
      .then((response) => {
        const edits = {
          name: props.group.name,
          description: props.group.description,
          location: props.group.location
        }
        expect(props.updateGroupSettings).toHaveBeenLastCalledWith(edits)
        expect(Toast.show).toHaveBeenCalled()
        expect(instance.state.changed).toBeFalsy()
      })
  })

  it('shows error toast when updates failed', () => {
    props.updateGroupSettings = jest.fn(() => Promise.resolve({ error: true }))
    const instance = ReactTestRenderer.create(<GroupSettings {...props} />).getInstance()
    jest.spyOn(Toast, 'show')
    instance.setState({ changed: true })
    return instance.saveChanges()
      .then((response) => {
        expect(Toast.show).toHaveBeenCalled()
        expect(instance.state.changed).toBeTruthy()
      })
  })

  describe('GroupBanner', () => {
    let props

    beforeEach(() => {
      props = {
        group: {
          id: 1,
          bannerUrl: 'yay.png',
          avatarUrl: 'pong.png'
        }
      }
    })

    it('matches the last snapshot', () => {
      const renderer = new ReactShallowRenderer()
      renderer.render(<GroupBanner {...props} />)
      const actual = renderer.getRenderOutput()

      expect(actual).toMatchSnapshot()
    })

    it('shows local images if present', () => {
      const instance = ReactTestRenderer.create(<GroupBanner {...props} />).getInstance()
      instance.setState({
        bannerLocalUri: 'bannerlocal.png',
        avatarLocalUri: 'avatarlocal.jpg'
      })

      expect(instance.toJSON).toMatchSnapshot()
    })

    it('populates onChoice and onPendingChange of second ImagePicker', () => {
      const node = ReactTestRenderer.create(<GroupBanner {...props} />)
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
        group: {
          id: 1
        },
        updateGroupSettings: jest.fn()
      }
      const local = 'local.uri'
      const remote = 'remote.uri'
      const instance = ReactTestRenderer.create(<GroupBanner {...props} />).getInstance()
      instance.onChoice({ local, remote }, 'banner')
      expect(instance.state.bannerLocalUri).toEqual(local)
      expect(props.updateGroupSettings).toHaveBeenCalledWith({ bannerUrl: remote })
    })

    it('shows a default banner if group has not set one', () => {
      props.group.bannerUrl = null
      const { root } = ReactTestRenderer.create(<GroupBanner {...props} />)
      const images = root.findAllByProps({ source: defaultBanner })

      // react-native's mockComponent.js causes some issues here by placing
      // child props on the parent. This means that the above will actually
      // find two components in the tree, not one. Hence we only check for a
      // non-zero length. https://github.com/facebook/react-native/issues/16281
      expect(images.length).not.toBe(0)
    })

    it('does not show a default banner if a local one has been set', () => {
      // Covers the case where group doesn't have a banner, but is trying to add
      // one through the client.
      props.group.bannerUrl = null
      const renderer = ReactTestRenderer.create(<GroupBanner {...props} />)
      renderer.getInstance().setState({ bannerLocalUri: 'flargle.jpg' })
      const images = renderer.root.findAllByProps({ source: defaultBanner })
      expect(images.length).toBe(0)
    })

    it('shows edit buttons', () => {
      const { root } = ReactTestRenderer.create(<GroupBanner {...props} />)
      expect(root.findAllByType(EditButton).length).toBe(2)
    })
  })
})
