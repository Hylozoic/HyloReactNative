import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import { TestRoot } from 'util/testing'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'

afterEach(cleanup)

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <TestRoot>
      <MockedScreen component={SignupFlow3} />
    </TestRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
