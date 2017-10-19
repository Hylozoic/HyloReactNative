import { Linking } from 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import LinkPreview, { openURL } from './LinkPreview'

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true))
  },
  TouchableOpacity: () => 'TouchableOpacity',
  Text: () => 'Text'
}))

describe('LinkPreview', () => {
  it('matches snapshot', () => {
    const renderer = new ReactShallowRenderer()
    const props = {
      title: 'Good Link',
      url: 'http://www.goodlink.com/thepage',
      imageUrl: 'rarara.com/ra.png'
    }

    renderer.render(<LinkPreview {...props} />)
    const actual = renderer.getRenderOutput()

    expect(actual).toMatchSnapshot()
  })
})

describe('openURL', () => {
  it('calls Linking.openURL', () => {
    const url = 'http://www.goodlink.com'
    openURL(url)
    .then(() => {
      expect(Linking.canOpenURL).toHaveBeenCalled()
      expect(Linking.openURL).toHaveBeenCalledWith(url)
    })
  })
})
