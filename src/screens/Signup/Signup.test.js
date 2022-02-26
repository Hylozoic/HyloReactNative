import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import getEmptyState from 'store/getEmptyState'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import Signup from './Signup'
import { SafeAreaProvider } from 'react-native-safe-area-context'

describe('Signup Specification', () => {
  afterEach(cleanup)

  it('renders with defaults', async () => {
    const store = createMockStore(getEmptyState())
    const { findByText, toJSON } =  render(
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Signup route={{ params: {} }}/>
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    )

    expect(await findByText('Enter your email address to get started:')).toBeTruthy()
    expect(await toJSON()).toMatchSnapshot()
  })
})
