import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import PostFooter from './PostFooter'

it('renders as expected', async () => {
  const { toJSON } = render(
    <TestRoot>
      <PostFooter
        commentersTotal={19}
        type='request'
        currentUser={{}}
        members={[]}
        eventAttendees={[]}
        showActivityLabel
        commenters={[
          { avatarUrl: 'a.png' },
          { avatarUrl: 'b.png' },
          { avatarUrl: 'c.png' }
        ]}
      />
    </TestRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
