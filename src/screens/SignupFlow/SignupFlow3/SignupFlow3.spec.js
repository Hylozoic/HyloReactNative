import React from 'react'
import { render, cleanup } from '@testing-library/react-native'
import MockedScreen from 'util/testing/MockedScreen'
import { ReactNativeTestingLibraryRoot } from 'util/testing'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'

afterEach(cleanup)

it('default render matches snapshot', async () => {
  const { toJSON } = render(
    <ReactNativeTestingLibraryRoot>
      <MockedScreen component={SignupFlow3} />
    </ReactNativeTestingLibraryRoot>
  )

  expect(await toJSON()).toMatchSnapshot()
})
