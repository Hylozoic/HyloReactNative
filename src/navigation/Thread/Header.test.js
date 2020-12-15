import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Header, { Title } from './Header'

describe('Header', () => {
  it('matches the last snapshot', () => {
    const route = {
      params: {
        title: 'Header Title',
        onPressTitle: () => {}
      }
    }
    const result = Header(route)
    expect(result).toMatchSnapshot()
  })
})

describe('Title', () => {
  it('matches the last snapshot', () => {
    const props = {
      title: 'Header Title',
      onPress: () => {}
    }
    const renderer = new ReactShallowRenderer()
    renderer.render(<Title {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})