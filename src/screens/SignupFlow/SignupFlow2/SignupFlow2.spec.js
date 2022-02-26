import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import { ReactNativeTestingLibraryRoot } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'
import MockedScreen from 'util/testing/MockedScreen'

afterEach(cleanup)

it.skip('default render matches snapshot', async () => {
  // TODO: Create a currentUser in store
  // currentUser={{
  //   id: 'test-user-id',
  //   name: 'test person'
  // }}

  const { toJSON } = render(
    <ReactNativeTestingLibraryRoot>
      <MockedScreen component={SignupFlow2} />
    </ReactNativeTestingLibraryRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
