import React from 'react'
import { Provider } from 'react-redux'
import orm from 'store/models'
import getEmptyState from 'store/getEmptyState'
import { render, waitFor } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import RootView from 'navigation/RootView'

// TODO: This is a first pass at using testing-library/react-native
// and I was able to make it work for a basic snapshot test, but nothing else
// due to a current bug with an await/timeout error when using any of the other
// async methods. Tracking this:
//   https://github.com/callstack/react-native-testing-library/issues/379

describe('RootView Specification', () => {
  it('renders Login when signedIn false', async () => {
    const state = getEmptyState()
    const { toJSON } = render(
      <Provider store={createMockStore(state)}>
        <RootView />
      </Provider>
    )
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot()
    })
  })
})
