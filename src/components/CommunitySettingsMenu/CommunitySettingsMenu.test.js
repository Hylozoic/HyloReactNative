import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import CommunitySettingsMenu from './CommunitySettingsMenu'
import ReactTestRenderer from 'react-test-renderer'

describe('CommunitySettingsMenu', () => {
  it('matches the last snapshot', () => {
    const renderer = new ReactShallowRenderer()
    renderer.render(<CommunitySettingsMenu communityName='foo' />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })

  it('has navigation options', () => {
    const props = {navigation: {state: {params: {}}}}
    expect(CommunitySettingsMenu.navigationOptions(props)).toMatchSnapshot()
  })

  it('navigates', () => {
    const props = {navigation: {navigate: jest.fn()}}

    const instance = ReactTestRenderer.create(<CommunitySettingsMenu {...props} />).getInstance()

    instance.navigate('somePath')
    expect(props.navigation.navigate).toHaveBeenCalledWith('somePath')
  })
})
