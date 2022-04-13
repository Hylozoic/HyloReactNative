import React from 'react'
import { Provider } from 'react-redux'
import { createInitialState } from 'store'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import RootNavigator from 'navigation/RootNavigator'

describe('RootNavigator Specification', () => {
  it.skip('renders Login when not authorized', async () => {
    const store = createMockStore(createInitialState())
    const { findByText, debug } = render(
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    )
    debug()
    expect(await findByText('Log in to Hylo')).toBeTruthy()
  })
})
