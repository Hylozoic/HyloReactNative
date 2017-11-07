import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import ReactTestRenderer from 'react-test-renderer'
import MemberProfile, { MemberBanner, EditButton, MemberHeader, ReadMoreButton, MemberMenu } from './MemberProfile'

jest.mock('react-native-device-info')
jest.mock('../ImagePicker', () => 'ImagePicker')

describe('MemberProfile', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile
      person={{id: 1}}
      canFlag
      id={1} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('doesnt have the flag content option', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile
      person={{id: 1}}
      canFlag={false}
      id={1} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('MemberBanner', () => {
  it('matches the last snapshot', () => {
    const person = {
      id: 1,
      bannerUrl: 'yay.png',
      avatarUrl: 'pong.png'
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberBanner
      person={person} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('shows local images if present', () => {
    const person = {
      id: 1,
      bannerUrl: 'yay.png',
      avatarUrl: 'pong.png'
    }
    const props = {
      person
    }

    const instance = ReactTestRenderer.create(<MemberBanner {...props} />).getInstance()
    instance.setState({
      bannerLocalUri: 'bannerlocal.png',
      avatarLocalUri: 'avatarlocal.jpg'
    })

    expect(instance.toJSON).toMatchSnapshot()
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

describe('MemberMenu', () => {
  it('returns null when flagging not allowed', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberMenu />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('returns a popupmenu when flagging allowed', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberMenu flagMember={() => { }} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('MemberHeader', () => {
  it('matches the last snapshot', () => {
    const person = {
      name: 'Jonas',
      location: 'whale',
      tagline: 'fingers crossed'
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberHeader
      flagMember={() => {}}
      person={person} />)
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
