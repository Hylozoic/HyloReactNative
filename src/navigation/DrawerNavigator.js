import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import TabsNavigator from 'navigation/TabsNavigator'
import DrawerMenu from 'screens/DrawerMenu'

const Drawer = createDrawerNavigator()
export default function DrawerNavigator () {
  const navigatorProps = {
    drawerType: 'slide',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: DrawerMenu
  }

  return (
    <Drawer.Navigator {...navigatorProps}>
      <Drawer.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}
