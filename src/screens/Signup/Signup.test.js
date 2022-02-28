import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import Signup from './Signup'

it('renders with defaults', async () => {
  const { findByText, toJSON } = render(
    <TestRoot>
      <Signup route={{ params: {} }} />
    </TestRoot>
  )
  expect(await findByText('Enter your email address to get started:')).toBeTruthy()
  expect(await toJSON()).toMatchSnapshot()
})
