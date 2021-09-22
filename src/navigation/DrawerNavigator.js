import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
// Navigation
import TabsNavigator from 'navigation/TabsNavigator'
// Screens
import DrawerMenu from 'screens/DrawerMenu'

const Drawer = createDrawerNavigator()
export default function DrawerNavigator () {
  const navigatorProps = {
    // Changed from React Navigation 5.x to 6.x but seems to not be needed (was for a moment?)
    // backBehavior: 'history',
    drawerType: 'slide',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: props => <DrawerMenu {...props} />
  }

  return <Drawer.Navigator {...navigatorProps}>
    <Drawer.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
  </Drawer.Navigator>
}
