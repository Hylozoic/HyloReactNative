import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function MockedScreen ({
  children,
  ...otherProps
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='MockedScreen'
          {...otherProps}
        >
          {children}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
