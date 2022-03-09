import React from 'react'
import { render } from '@testing-library/react-native'
import { TestRoot } from 'util/testing'
import InviteExpired from 'screens/InviteExpired'
import MockedScreen from 'util/testing/MockedScreen'

it('default render matches snapshot', async () => {
  const { getByText } = render(
    <TestRoot>
      <MockedScreen component={InviteExpired} />
    </TestRoot>
  )

  expect(await getByText(/Invitation has expired/)).toBeTruthy()
})
