import React from 'react'
import { Provider } from 'react-redux'
import { createInitialState } from 'store'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import InviteExpired from 'screens/InviteExpired'

describe('InviteExpired Specification', () => {
  afterEach(cleanup)

  it('default render matches snapshot', async () => {
    const state = createInitialState()
    const { getByText } = render(
      <Provider store={createMockStore(state)}>
        <InviteExpired navigation={{ setOptions: jest.fn() }} />
      </Provider>
    )

    expect(await getByText(/Invitation has expired/)).toBeTruthy()
  })
})
