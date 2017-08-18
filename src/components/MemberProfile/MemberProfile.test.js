import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import MemberProfile, { MemberBanner, MemberHeader, ReadMoreButton } from './MemberProfile'

describe('MemberProfile', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberProfile
      person={{id: 1}}
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

describe('MemberHeader', () => {
  it('matches the last snapshot', () => {
    const person = {
      name: 'Jonas',
      location: 'whale',
      tagline: 'fingers crossed'
    }

    const renderer = new ReactShallowRenderer()
    renderer.render(<MemberHeader
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
