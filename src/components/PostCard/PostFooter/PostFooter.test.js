import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import PostFooter from './PostFooter'

it('renders as expected', async () => {
  const { toJSON } = render(
    <TestRoot>
      <PostFooter
        myVote
        votesTotal={71}
        commentersTotal={19}
        vote={() => {}}
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
