import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import Topics from './Topics'

jest.mock('react-native-device-info')

it('renders correctly a community and topics', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    community: {
      name: 'Foomunity',
      bannerUrl: 'community-banner.png'
    },
    topics: [1, 2, 3],
    toggleTopicSubscribe: () => {},
    goToTopic: () => {}
  }
  renderer.render(<Topics {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})

it('renders correctly with pending=true', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    community: {
      name: 'Foomunity',
      bannerUrl: 'community-banner.png'
    },
    topics: [1, 2, 3],
    pending: true,
    toggleTopicSubscribe: () => {},
    goToTopic: () => {}
  }
  renderer.render(<Topics {...props} />)
  const actual = renderer.getRenderOutput()

  expect(actual).toMatchSnapshot()
})
