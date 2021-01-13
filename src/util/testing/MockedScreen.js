import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function MockedNavigator ({
  children,
  component,
  ...otherProps
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='MockedScreen'
          component={() => children}
          {...otherProps}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
