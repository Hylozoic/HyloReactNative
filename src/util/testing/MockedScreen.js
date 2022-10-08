import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { TRenderEngineProvider } from 'react-native-render-html'

const Stack = createStackNavigator()

export default function MockedScreen ({
  children,
  ...otherProps
}) {
  if (children) {
    return (
      <TRenderEngineProvider>
        <Stack.Navigator>
          <Stack.Screen name='MockedScreen' {...otherProps}>
            {props => children(props)}
          </Stack.Screen>
        </Stack.Navigator>
      </TRenderEngineProvider>
    )
  } else {
    return (
      <TRenderEngineProvider>
        <Stack.Navigator>
          <Stack.Screen
            name='MockedScreen'
            {...otherProps}
          />
        </Stack.Navigator>
      </TRenderEngineProvider>
    )
  }
}
