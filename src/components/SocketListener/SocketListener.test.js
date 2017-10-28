import React from 'react'
import TestRenderer from 'react-test-renderer'
import SocketListener from './SocketListener'
import { getSocket } from 'util/websockets'

jest.mock('util/websockets', () => {
  const socket = {
    post: jest.fn(),
    on: jest.fn()
  }

  return {
    getSocket: () => Promise.resolve(socket),
    socketUrl: path => 'sockethost' + path
  }
})

it('sets up reconnection behavior', async () => {
  const renderer = await TestRenderer.create(<SocketListener
    setupCoreEventHandlers={() => {}} />)

  const socket = await getSocket()

  expect(socket.on.mock.calls.map(x => x[0])).toEqual([
    'commentAdded',
    'messageAdded',
    'newNotification',
    'newPost',
    'newThread',
    'userTyping',
    'reconnect'
  ])

  expect(socket.on.mock.calls.find(x => x[0] === 'reconnect')[1])
  .toEqual(renderer.root.instance.reconnect)

  expect(socket.post).toHaveBeenCalledWith('sockethost/noo/threads/subscribe', expect.any(Function))
})
