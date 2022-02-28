import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import SignupFlow0 from 'screens/SignupFlow/SignupFlow0'
import MockedScreen from 'util/testing/MockedScreen'

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <TestRoot>
      <MockedScreen component={SignupFlow0} />
    </TestRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
