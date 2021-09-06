import React from 'react'
import { Provider } from 'react-redux'
import orm from 'store/models'
import { act } from 'react-test-renderer'
import { render } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import { NavigationContainer } from '@react-navigation/native'
import RootView from 'navigation/RootView'

// TODO: This is a first pass at using testing-library/react-native
// and I was able to make it work for a basic snapshot test, but nothing else
// due to a current bug with an await/timeout error when using any of the other
// async methods. Tracking this:
//   https://github.com/callstack/react-native-testing-library/issues/379
describe('Navigation Specification', () => {
  it('renders Login when signedIn false', async () => {
    const state = {
      orm: orm.getEmptyState(),
      FeedList: {},
      queryResults: {},
      pending: {},
      session: {}
    }
    const component = (
      <Provider store={createMockStore(state)}>
        <NavigationContainer>
          <RootView />
        </NavigationContainer>
      </Provider>
    )
    const { toJSON } = render(component)
    // await findByAccessibilityRole('Header')

    await act(async () => {
      expect(toJSON()).toMatchSnapshot()  
    })
  })
})
