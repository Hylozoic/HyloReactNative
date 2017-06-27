import React from 'react'
import { TabNavigator, StackNavigator } from "react-navigation"

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'
import Settings from './Settings'

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

function createRouteConfigs() {
  const stackNavigators = {};
  const routeConfigs = {};
  for (const key of Object.keys(tabs)) {
      const obj = {};
      obj[key] = tabs[key];
      const tabPaths = Object.assign({}, ...[obj, screens]);
      const tabConfigs = {
        initialRouteName: key
      }
      stackNavigators[`${key}Navigator`] = StackNavigator(tabPaths, tabConfigs);
      routeConfigs[key] = { screen: stackNavigators[`${key}Navigator`]};
  }
  return routeConfigs;
}

const NavigatorWithBar = TabNavigator(createRouteConfigs(), tabNavigatorConfig);
export default NavigatorWithBar;
