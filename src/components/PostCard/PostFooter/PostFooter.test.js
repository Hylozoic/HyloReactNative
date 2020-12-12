import PostFooter from './PostFooter'
import ReactShallowRenderer from 'react-test-renderer/shallow'
import React from 'react'

it('renders as expected', () => {
  const renderer = new ReactShallowRenderer()
  const footer = (
    <PostFooter
      myVote
      votesTotal={71}
      commentsTotal={36}
      vote={() => {}}
      commenters={[
        { avatarUrl: 'a.png' },
        { avatarUrl: 'b.png' },
        { avatarUrl: 'c.png' }
      ]}
    />
  )
  expect(renderer.render(footer)).toMatchSnapshot()
})
