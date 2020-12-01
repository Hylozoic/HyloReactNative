import { createStackNavigator } from 'react-navigation'
import React from 'react'
import TabIcon from '../Tabs/TabIcon'
import TabLabel from '../Tabs/TabLabel'

function removePathsUnlessHomeTab (screens, tabName) {
  const screensCopy = screens
  if (tabName !== 'Home') {
    for (let key in screensCopy) {
      if (screensCopy.hasOwnProperty(key)) {
        delete screensCopy[key].path
      }
    }
  }
  return screensCopy
}

function stackNavigatorFactory (tabObject, otherScreens, tabName) {
  otherScreens = removePathsUnlessHomeTab(otherScreens, tabName)
  const paths = Object.assign({}, tabObject, otherScreens)
  const config = {
    initialRouteName: tabName
  }

  const stackNavigator = createStackNavigator(
    paths,
    config
  )

  return stackNavigator
}

export default function stacksInTabsFactory (tabs, screens) {
  // merge tabs and scenes
  // add configuration options for each scene
  // create a createStackNavigator for each tab
  // return an object that can be passed into createBottomTabNavigator
  const routeConfigs = {}
  for (const key of Object.keys(tabs)) {
    const obj = {}
    obj[key] = tabs[key]
    routeConfigs[key] = {
      screen: stackNavigatorFactory(obj, screens, key),
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <TabIcon name={key} focused={focused} />
        ),
        tabBarLabel: ({ focused }) => (
          <TabLabel name={key} focused={focused} />
        )
      }
    }
  }
  return routeConfigs
}
