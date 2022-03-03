import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import MockedScreen from 'util/testing/MockedScreen'
import SignupFlow1 from 'screens/SignupFlow/SignupFlow1'

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <TestRoot>
      <MockedScreen component={SignupFlow1} />
    </TestRoot>
  )
  expect(await toJSON()).toMatchSnapshot()
})
