import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MemberProfile, { MemberBanner, MemberHeader, ReadMoreButton, MemberMenu } from './MemberProfile'

jest.mock('react-native-device-info')

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
      bannerUrl: 'yay.png',
      avatarUrl: 'pong.png'
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberBanner
      person={person} />)
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
