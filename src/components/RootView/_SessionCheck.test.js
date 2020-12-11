import 'react-native'
import React from 'react'
import TestRenderer from 'react-test-renderer'
import SessionCheck from './SessionCheck'

it('calls checkSession', async () => {
  const props = {
    checkSession: jest.fn(() => Promise.resolve(true))
  }
  await TestRenderer.create(<SessionCheck {...props}>hi</SessionCheck>)
  expect(props.checkSession).toHaveBeenCalled()
})