import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import { ReactNativeTestingLibraryRoot } from 'util/testing'
import SignupFlow0 from 'screens/SignupFlow/SignupFlow0'
import MockedScreen from 'util/testing/MockedScreen'

afterEach(cleanup)

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <ReactNativeTestingLibraryRoot>
      <MockedScreen component={SignupFlow0} />
    </ReactNativeTestingLibraryRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
