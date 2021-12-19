import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlowEmailVerificationFinish from 'screens/SignupFlow/SignupFlowEmailVerificationFinish'

describe('SignupFlowEmailVerificationFinish Specification', () => {
  afterEach(cleanup)

  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <SignupFlowEmailVerificationFinish
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
