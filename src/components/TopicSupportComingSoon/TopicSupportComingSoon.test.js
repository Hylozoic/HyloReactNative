import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import TopicSupportComingSoon from './TopicSupportComingSoon'

it('matches last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const styles = {
    container: {
      some: 'styles'
    }
  }
  const route = {
    params: {
      onBack: jest.fn()
    }
  }
  const navigation = {
    goBack: jest.fn()
  }
  renderer.render(
    <TopicSupportComingSoon style={styles} route={route} navigation={navigation} />
  )
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})
