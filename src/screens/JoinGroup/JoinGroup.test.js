import 'react-native'
import React from 'react'
import JoinGroup from './JoinGroup'
import { createMockStore } from 'util/testing'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from 'screens/Login'
import getEmptyState from 'store/getEmptyState'

it('forwards to Login when not signedIn', async () => {
  const props = {
    route: { params: {} },
    navigation: {}
  }
  const state = {
    ...getEmptyState(),
    session: {
      signedIn: false
    }
  }
  const TestNavigator = createStackNavigator()
  const { getByText } = render(
    <Provider store={createMockStore(state)}>
      <NavigationContainer>
        <TestNavigator.Navigator>
          <TestNavigator.Screen name='JoinGroup' component={JoinGroup} />
          <TestNavigator.Screen name='Login' component={Login} />
        </TestNavigator.Navigator>
      </NavigationContainer>
    </Provider>
  )

  expect(await getByText('Log in to Hylo')).toBeTruthy()  
})
