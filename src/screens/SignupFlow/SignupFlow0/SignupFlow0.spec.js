import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow0 from 'screens/SignupFlow/SignupFlow0'

describe('SignupFlow0 Specification', () => {
  afterEach(cleanup)

  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <SignupFlow0
          location='Hull'
          saveAndNext={() => {}}
          changeSetting={() => {}}
          route={{ params: {} }}
        />
      </Provider>
    )
    expect(await toJSON()).toMatchSnapshot()
  })
})
