import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberProfile, { MemberBanner, EditButton, ReadMoreButton } from './MemberProfile'
import ImagePicker from '../ImagePicker'
import defaultBanner from '../../assets/default-user-banner.jpg'

jest.mock('../ImagePicker', props => 'ImagePicker')
jest.mock('./MemberFeed', () => 'MemberFeed')

describe('MemberProfile', () => {
  let props

  beforeEach(() => {
    props = {
      canFlag: true,
      fetchPerson: jest.fn(),
      id: 1,
      isFocused: true,
      person: { id: 1 }
    }
  })

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('doesnt have the flag content option', () => {
    props.canFlag = false
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('loads a new user when user id changes', () => {
    const renderer = ReactTestRenderer.create(<MemberProfile {...props} />)
    renderer.getInstance().componentDidUpdate({ id: 2 })
    // Once for the first render, once for the update
    expect(props.fetchPerson.mock.calls.length).toBe(2)
  })

  it('does nothing if unfocused', () => {
    const renderer = ReactTestRenderer.create(<MemberProfile {...props} />)
    const nextProps = { isFocused: false }
    const actual = renderer.getInstance().shouldComponentUpdate(nextProps)
    expect(actual).toBe(false)
  })

  it('shows loading without a person', () => {
    props.person = undefined
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('MemberBanner', () => {
  let props

  beforeEach(() => {
    props = {
      person: {
        id: 1,
        bannerUrl: 'yay.png',
        avatarUrl: 'pong.png'
      }
    }
  })

  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberBanner {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('shows local images if present', () => {
    const instance = ReactTestRenderer.create(<MemberBanner {...props} />).getInstance()
    instance.setState({
      bannerLocalUri: 'bannerlocal.png',
      avatarLocalUri: 'avatarlocal.jpg'
    })

    expect(instance.toJSON).toMatchSnapshot()
  })

  it('populates onChoice and onPendingChange of second ImagePicker', () => {
    const node = ReactTestRenderer.create(<MemberBanner {...props} />)
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
      person: {
        id: 1
      },
      updateUserSettings: jest.fn()
    }
    const local = 'local.uri'
    const remote = 'remote.uri'
    const instance = ReactTestRenderer.create(<MemberBanner {...props} />).getInstance()
    instance.onChoice({local, remote}, 'banner')
    expect(instance.state.bannerLocalUri).toEqual(local)
    expect(props.updateUserSettings).toHaveBeenCalledWith({bannerUrl: remote})
  })

  it('shows a default banner if user has not set one', () => {
    props.person.bannerUrl = null
    const { root } = ReactTestRenderer.create(<MemberBanner {...props} />)
    const images = root.findAllByProps({ source: defaultBanner })

    // react-native's mockComponent.js causes some issues here by placing
    // child props on the parent. This means that the above will actually
    // find two components in the tree, not one. Hence we only check for a
    // non-zero length. https://github.com/facebook/react-native/issues/16281
    expect(images.length).not.toBe(0)
  })

  it('does not show a default banner if a local one has been set', () => {
    // Covers the case where user doesn't have a banner, but is trying to add
    // one through the client.
    props.person.bannerUrl = null
    const renderer = ReactTestRenderer.create(<MemberBanner {...props} />)
    renderer.getInstance().setState({ bannerLocalUri: 'flargle.jpg' })
    const images = renderer.root.findAllByProps({ source: defaultBanner })
    expect(images.length).toBe(0)
  })

  it('does not show edit buttons if member is not current user', () => {
    const { root } = ReactTestRenderer.create(<MemberBanner {...props} />)
    expect(root.findAllByType(EditButton).length).toBe(0)
  })

  it('shows edit buttons if member is current user', () => {
    props.isMe = true
    const { root } = ReactTestRenderer.create(<MemberBanner {...props} />)
    expect(root.findAllByType(EditButton).length).toBe(2)
  })
})

describe('EditButton', () => {
  it('matches the last snapshot when isLoading is false', () => {
    const props = {
      isLoading: false
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<EditButton {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('matches the last snapshot when isLoading is true', () => {
    const props = {
      isLoading: true
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<EditButton {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('ReadMoreButton', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<ReadMoreButton
      goToDetails={() => {}} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})
