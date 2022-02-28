import React from 'react'
import { render } from '@testing-library/react-native'
import { createInitialStateWithCurrentUser, TestRoot } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import MockedScreen from 'util/testing/MockedScreen'

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <TestRoot state={createInitialStateWithCurrentUser()}>
      <MockedScreen component={SignupFlow2} />
    </TestRoot>
  )
  expect(await toJSON()).toMatchSnapshot()
})
