import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import JoinCommunity from './JoinCommunity'

jest.mock('../Loading', () => ({LoadingScreen: 'LoadingScreen'}))

it('calls useInvitation', async () => {
  const props = {
    useInvitation: jest.fn()
  }
  await TestRenderer.create(<JoinCommunity {...props} />)
  expect(props.useInvitation).toHaveBeenCalled()
})
