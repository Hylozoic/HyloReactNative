import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { TRenderEngineProvider } from 'react-native-render-html'
import { HyloHTMLConfigProvider } from 'components/HyloHTML/HyloHTML'
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
        <HyloHTMLConfigProvider>
          {/* <Stack.Navigator> */}
            <Tabs.Navigator>
              <Tabs.Screen name='MockedScreen' {...otherProps}>
                {props => children(props)}
              </Tabs.Screen>
            </Tabs.Navigator>
          {/* </Stack.Navigator> */}
        </HyloHTMLConfigProvider>
      </TRenderEngineProvider>
    )
  } else {
    return (
      <TRenderEngineProvider>
        <HyloHTMLConfigProvider>
          <Stack.Navigator>
            <Stack.Screen
              name='MockedScreen'
              {...otherProps}
            />
          </Stack.Navigator>
        </HyloHTMLConfigProvider>
      </TRenderEngineProvider>
    )
  }
}
