import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import CheckInvitation from './CheckInvitation'

jest.mock('../Loading', () => ({LoadingScreen: 'LoadingScreen'}))

it('calls checkInvitation', async () => {
  const props = {
    checkInvitation: jest.fn(() => Promise.resolve(true))
  }
  await TestRenderer.create(<CheckInvitation {...props} />)
  expect(props.checkInvitation).toHaveBeenCalled()
})
