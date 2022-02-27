import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import { createInitialStateWithCurrentUser, TestRoot } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import MockedScreen from 'util/testing/MockedScreen'

afterEach(cleanup)

it('default render matches snapshot', async () => {
  const currentUserState = createInitialStateWithCurrentUser()
  const { toJSON } = render(
    <TestRoot state={currentUserState}>
      <MockedScreen component={SignupFlow2} />
    </TestRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
