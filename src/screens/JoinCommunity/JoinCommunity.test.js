import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import JoinCommunity from './JoinCommunity'

jest.mock('screens/LoadingScreen', () => 'LoadingScreen')

it('calls useInvitation', async () => {
  const props = {
    checkOrUseInvitation: jest.fn()
  }
  await TestRenderer.create(<JoinCommunity {...props} />)
  expect(props.checkOrUseInvitation).toHaveBeenCalled()
})
