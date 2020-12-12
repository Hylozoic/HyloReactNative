import React from 'react'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { act } from 'react-test-renderer'
import { render, cleanup } from '@testing-library/react-native'
import RootNavigator from 'navigation'
import { createMockStore } from 'util/testing'
import ErrorBoundary from 'components/ErrorBoundary'

// TODO: This is a first pass at using testing-library/react-native
// and I was able to make it work for a basic snapshot test, but nothing else
// due to a current bug with an await/timeout error when using any of the other
// async methods. Tracking this:
//   https://github.com/callstack/react-native-testing-library/issues/379
describe('Navigation Specification', () => {
  afterEach(cleanup)

  test('It renders Login when isSignedIn false', async () => {
    const state = {
      orm: orm.getEmptyState(),
      FeedList: {},
      queryResults: {},
      pending: {},
      session: {}
    }
    const component = (
      <ErrorBoundary>
        <Provider store={createMockStore(state)}>
          <RootNavigator isSignedIn={false} />
        </Provider>
      </ErrorBoundary>
    )
    const { toJSON } = render(component)
    // await findByAccessibilityRole('Header')

    await act(async () => {
      expect(toJSON()).toMatchSnapshot()  
    })
  })
})
