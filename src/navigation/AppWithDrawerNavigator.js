import 'react-native-gesture-handler' // is this necessary?
import React from 'react'
import { Dimensions } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AppNavigator from 'navigation/AppNavigator'
import DrawerMenu from 'screens/DrawerMenu'
import JoinCommunity from 'screens/JoinCommunity'
import InviteExpired from 'screens/InviteExpired'

const AppWithDrawer = createDrawerNavigator()

export default function AppWithDrawerNavigator () {
  const navigatorProps = {
    drawerType: 'slide',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: props => <DrawerMenu {...props} />
  }

  return (
    <AppWithDrawer.Navigator {...navigatorProps}>
      <AppWithDrawer.Screen name='AppNavigator' component={AppNavigator} />
      <AppWithDrawer.Screen name='JoinCommunity' component={JoinCommunity} />
      <AppWithDrawer.Screen name='InviteExpired' component={InviteExpired} />
    </AppWithDrawer.Navigator>
  )
}
