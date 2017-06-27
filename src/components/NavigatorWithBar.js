import React from 'react'
import { TabNavigator, StackNavigator } from "react-navigation"
import { Text, TouchableOpacity } from 'react-native'

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'
import Settings from './Settings'

export default function NavigatorWithBar ({ openDrawer }) {

  const tabs = {
    Home: {screen: MyPosts},
    Members: {screen: WelcomeScene},
    Topics: {screen: WelcomeScene}
  }

  const screens = {
    Post: {screen: Post},
    MyPosts: {screen: MyPosts},
    WelcomeScene: {screen: WelcomeScene},
    Settings: {screen: Settings}
  }

  Object.freeze(tabs);
  Object.freeze(screens);

  const tabNavigatorConfig = {
    tabBarPosition: 'bottom'
  }

  const NavigatorWithBar = TabNavigator(
    mergeRouteConfigsByTab(openDrawer, tabs, screens),
    tabNavigatorConfig
  );

  return <NavigatorWithBar />;
}

function mergeRouteConfigsByTab(openDrawer, tabs, screens) {
  const stackNavigators = {};
  const routeConfigs = {};
  for (const key of Object.keys(tabs)) {
      const obj = {};
      obj[key] = tabs[key];
      const tabPaths = Object.assign({}, ...[obj, screens]);
      const tabConfigs = {
        initialRouteName: key,
        navigationOptions: {
          title: key,
          headerRight: <TouchableOpacity>
                        <Text onPress={openDrawer}>Menu</Text>
                      </TouchableOpacity>
        }
      }
      stackNavigators[`${key}Navigator`] = StackNavigator(
        tabPaths, tabConfigs
      );
      routeConfigs[key] = { screen: stackNavigators[`${key}Navigator`]};
  }
  return routeConfigs;
}
