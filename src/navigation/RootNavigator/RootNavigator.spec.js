import React from 'react'
import { Provider } from 'react-redux'
import { createInitialState } from 'store'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import RootNavigator from 'navigation/RootNavigator'

describe('RootNavigator Specification', () => {
  it('renders Login when not authorized', async () => {
    const store = createMockStore(createInitialState())
    const { findByText } = render(
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    )
    expect(await findByText('Log in to Hylo')).toBeTruthy()
  })
})
