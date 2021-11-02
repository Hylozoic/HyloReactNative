import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow3 from 'screens/SignupFlow/SignupFlow3'

describe('SignupFlow3 Specification', () => {
  it('default render matches snapshot', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <SignupFlow3
          location='Hull'
          saveAndNext={() => {}}
          changeSetting={() => {}}
        />
      </Provider>
    )
    expect(await toJSON()).toMatchSnapshot()
  })
})
