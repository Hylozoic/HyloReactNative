import {
  StackNavigator
} from 'react-navigation'
import React from 'react'
import { View, Text } from 'react-native'

import { jade } from 'style/colors'
import Icon from '../Icon'

function stackNavigatorFactory (tabObject, otherScreens, tabName) {
  const paths = Object.assign({}, ...[tabObject, otherScreens])
  const config = {
    initialRouteName: tabName
  }

  const stackNavigator = StackNavigator(
    paths,
    config
  )

  return stackNavigator
}

export default function stacksInTabsFactory (tabs, screens) {
  // merge tabs and scenes
  // add configuration options for each scene
  // create a StackNavigator for each tab
  // return an object that can be passed into TabNavigator
  const routeConfigs = {}
  for (const key of Object.keys(tabs)) {
    const obj = {}
    obj[key] = tabs[key]
    routeConfigs[key] = {
      screen: stackNavigatorFactory(obj, screens, key),
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => {
          const styles = {textAlign: 'center'}
          if (focused) styles.color = jade
          return <View>
            <Icon name={key} style={styles} size={25} />
            <Text style={styles}>{key}</Text>
          </View>
        }
      }
    }
  }
  return routeConfigs
}
