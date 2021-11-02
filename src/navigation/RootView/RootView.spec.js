import React from 'react'
import { Provider } from 'react-redux'
import getEmptyState from 'store/getEmptyState'
import { render, waitFor } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import RootView from 'navigation/RootView'

describe('RootView Specification', () => {
  it('renders Login when signedIn false', async () => {
    const store = createMockStore(getEmptyState())
    const { findByText } =  render(
      <Provider store={store}>
        <RootView />
      </Provider>
    )
    expect(await findByText('Log in to Hylo')).toBeTruthy()
  })
})
