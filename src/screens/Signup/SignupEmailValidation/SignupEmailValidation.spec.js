import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import SignupEmailValidation from 'screens/Signup/SignupEmailValidation'
import MockedScreen from 'util/testing/MockedScreen'

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <TestRoot>
      <MockedScreen component={SignupEmailValidation} />
    </TestRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
