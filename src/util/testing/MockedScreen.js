import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { TRenderEngineProvider } from 'react-native-render-html'
import { HlyoHTMLConfigProvider } from 'components/HyloHTML/HyloHTML'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Stack = createStackNavigator()
const Tabs = createBottomTabNavigator()

export default function MockedScreen ({
  children,
  ...otherProps
}) {
  if (children) {
    return (
      <TRenderEngineProvider>
        <HlyoHTMLConfigProvider>
          {/* <Stack.Navigator> */}
            <Tabs.Navigator>
              <Tabs.Screen name='MockedScreen' {...otherProps}>
                {props => children(props)}
              </Tabs.Screen>
            </Tabs.Navigator>
          {/* </Stack.Navigator> */}
        </HlyoHTMLConfigProvider>
      </TRenderEngineProvider>
    )
  } else {
    return (
      <TRenderEngineProvider>
        <HlyoHTMLConfigProvider>
          <Stack.Navigator>
            <Stack.Screen
              name='MockedScreen'
              {...otherProps}
            />
          </Stack.Navigator>
        </HlyoHTMLConfigProvider>
      </TRenderEngineProvider>
    )
  }
}
