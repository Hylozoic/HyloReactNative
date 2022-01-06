import React from 'react'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import getEmptyState from 'store/getEmptyState'
import { render, cleanup } from '@testing-library/react-native'
import { createMockStore } from 'util/testing'
import SignupFlow2 from 'screens/SignupFlow/SignupFlow2'


afterEach(cleanup)

it('default render matches snapshot', async () => {
  const state = getEmptyState()
  const { toJSON } = render(
    <Provider store={createMockStore(state)}>
      <NavigationContainer>
        <SignupFlow2
          currentUser={{ id: 'test-user-id', name: 'test person' }}
          location='Hull'
          saveAndNext={() => {}}
          changeSetting={() => {}}
        />
      </NavigationContainer>
    </Provider>
  )

  expect(await toJSON()).toMatchSnapshot()
})
