import 'react-native'
import React from 'react'
import JoinGroup from './JoinGroup'
import { TestRoot } from 'util/testing'
import { render } from '@testing-library/react-native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from 'screens/Login'

const TestNavigator = createStackNavigator()

it('forwards to Login when not signedIn', async () => {
  const { getByText } = render(
    <TestRoot>
      <TestNavigator.Navigator>
        <TestNavigator.Screen name='JoinGroup' component={JoinGroup} />
        <TestNavigator.Screen name='Login' component={Login} />
      </TestNavigator.Navigator>
    </TestRoot>
  )

  expect(await getByText('Log in to Hylo')).toBeTruthy()
})
