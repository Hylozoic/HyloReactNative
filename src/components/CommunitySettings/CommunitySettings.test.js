import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommunitySettings from './CommunitySettings'
import ReactTestRenderer from 'react-test-renderer'

describe('CommunitySettings', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunitySettings communityName='foo' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {}}}}
    expect(CommunitySettings.navigationOptions(props)).toMatchSnapshot()
  })

  it('navigates', () => {
    const props = {navigation: {navigate: jest.fn()}}

    const instance = ReactTestRenderer.create(<CommunitySettings {...props} />).getInstance()

    instance.navigate('somePath')
    expect(props.navigation.navigate).toHaveBeenCalledWith('somePath')
  })
})
