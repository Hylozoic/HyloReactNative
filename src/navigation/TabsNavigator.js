import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { isIOS } from 'util/platform'
// Helpers
import TabIcon from 'navigation/Tabs/TabIcon'
import TabLabel from 'navigation/Tabs/TabLabel'
import tabStyles from 'navigation/Tabs/Tabs.styles'
// Screens
import Feed from 'screens/Feed'
import Members from 'screens/Members'
import Projects from 'screens/Projects'
import Topics from 'screens/Topics'

const Tabs = createBottomTabNavigator()

export default function TabsNavigator () {
  const navigatorProps = {
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      pressColor: '#DCDCDC',
      indicatorStyle: { backgroundColor: 'white' },
      style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused }) =>
        <TabIcon name={route.name} focused={focused} />,
      tabBarLabel: ({ focused }) =>
        <TabLabel name={route.name} focused={focused} />
    })
  }

  return (
    <Tabs.Navigator {...navigatorProps}>
      <Tabs.Screen name='Home' component={Feed} />
      <Tabs.Screen name='Members' component={Members} />
      <Tabs.Screen name='Topics' component={Topics} />
      <Tabs.Screen name='Projects' component={Projects} />
    </Tabs.Navigator>
  )
}
