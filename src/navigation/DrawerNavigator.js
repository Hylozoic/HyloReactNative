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
    // Without this the Drawer was sometimes re-opening after
    // navigating to a group Feed.
    // Possibly something to do with Reanimated 2.0 config.
    // useLegacyImplementation: true,
    // * Had to do away with that due to needing to move to reanimated 3.x for RN support from 0.69+
    // Seems to be working wonderfully now. Will monitor. See issue for details on dependencies:
    // https://github.com/react-navigation/react-navigation/issues/10909#issuecomment-1266955497
    drawerContent: props => (
      <DrawerMenu {...props} />
    )
  }

  return (
    <Drawer.Navigator {...navigatorProps}>
      <Drawer.Screen name='Tabs' component={TabsNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  )
}
