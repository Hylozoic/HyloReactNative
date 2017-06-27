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
  // merge tabs and scenes
  // add configuration options for each scene
  // create a StackNavigator for each tab
  // return an object that can be passed into TabNavigator
  const stackNavigators = {};
  const routeConfigs = {};
  for (const key of Object.keys(tabs)) {
      const obj = {};
      obj[key] = tabs[key];
      const stackPaths = Object.assign({}, ...[obj, screens]);
      const sceneConfigs = {
        initialRouteName: key,
        navigationOptions: {
          title: key,
          headerRight: <TouchableOpacity>
                        <Text onPress={openDrawer}>Menu</Text>
                      </TouchableOpacity>
        }
      }
      stackNavigators[`${key}Navigator`] = StackNavigator(
        stackPaths, sceneConfigs
      );
      routeConfigs[key] = { screen: stackNavigators[`${key}Navigator`]};
  }
  return routeConfigs;
}
