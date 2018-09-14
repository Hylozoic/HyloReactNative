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
  renderer.render(<TopicSupportComingSoon style={styles} />)
  const actual = renderer.getRenderOutput()
  expect(actual).toMatchSnapshot()
})
