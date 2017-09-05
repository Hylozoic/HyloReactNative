import 'react-native'
import React from 'react'
import ReactShallowRenderer from 'react-test-renderer/shallow'

import Thread from './Thread'

it('matches the last snapshot', () => {
  const renderer = new ReactShallowRenderer()
  const props = {
    createMessage: () => {},
    currentUserId: '1',
    fetchMessages: () => {},
    messages: [
      {
        id: "56025",
        createdAt: "Mon Aug 14 2017 18:58:37 GMT+1200 (NZST)",
        text: "Flargle argle",
        creator: { id: "86894" }
      },
      {
        id: "56024",
        createdAt: "Mon Aug 14 2017 17:27:42 GMT+1200 (NZST)",
        text: "Argle bargle",
        creator: { id: "86895" }
      },
      {
        id: "56023",
        createdAt: "Mon Aug 14 2017 15:24:36 GMT+1200 (NZST)",
        text: "Bargle wargle",
        creator: { id: "86895" }
      }
    ],
    reconnectFetchMessages: () => {},
    setTitle: () => {},
    updateThreadReadTime: () => {}
  }

  renderer.render(<Thread { ...props } />)
  expect(renderer.getRenderOutput()).toMatchSnapshot()
})
