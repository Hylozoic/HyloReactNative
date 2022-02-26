import React from 'react'
import { Provider } from 'react-redux'
import { getEmptyState } from 'store/reducers/resetStore'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import RootView from 'navigation/RootView'

describe('RootView Specification', () => {
  afterEach(cleanup)

  it('renders Login when signedIn false', async () => {
    const store = createMockStore(getEmptyState())
    const { findByText } = render(
      <Provider store={store}>
        <RootView />
      </Provider>
    )
    expect(await findByText('Log in to Hylo')).toBeTruthy()
  })
})
