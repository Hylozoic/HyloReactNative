import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'


afterEach(cleanup)

it('default render matches snapshot', async () => {
  const state = getEmptyState()
  const { toJSON } = render(
    <Provider store={createMockStore(state)}>
      <SignupFlow2
        currentUser={{ name: 'test person' }}
        location='Hull'
        saveAndNext={() => {}}
        changeSetting={() => {}}
      />
    </Provider>
  )

  expect(await toJSON()).toMatchSnapshot()
})
