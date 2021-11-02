import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'

describe('SignupFlow2 Specification', () => {
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
})
