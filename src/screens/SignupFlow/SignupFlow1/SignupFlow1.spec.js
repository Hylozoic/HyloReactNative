import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render, waitFor } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow1 from 'screens/SignupFlow/SignupFlow1'

describe('SignupFlow1 Specification', () => {
  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <SignupFlow1
          location='Hull'
          saveAndNext={() => {}}
          changeSetting={() => {}}
        />
      </Provider>
    )
    await waitFor(() => 
      expect(toJSON()).toMatchSnapshot()
    )
  })
})
