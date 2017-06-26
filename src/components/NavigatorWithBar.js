import React from 'react'
import { TabNavigator, StackNavigator } from "react-navigation"

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'


export default function NavigatorWithBar () {
  const stackNavigators = {};
  const routeConfigs = {};
  for (const key of Object.keys(tabScreens)) {
      const obj = {};
      obj[key] = tabScreens[key];
      const tabPaths = Object.assign(paths, obj);
      const tabConfigs = {
        initialRouteName: tabScreens[key]
      }
      stackNavigators[`${key}Navigator`] = StackNavigator(tabPaths, tabConfigs);
      routeConfigs[key] = { screen: stackNavigators[`${key}Navigator`]};
  }
  const nav = TabNavigator(routeConfigs, navigatorConfig);
  return nav;
}

const tabScreens = {
  Home: {screen: MyPosts},
  Members: {screen: WelcomeScene},
  Topics: {screen: WelcomeScene}
}

const paths = {
  Post: {screen: Post},
  MyPosts: {screen: MyPosts},
  WelcomeScene: {screen: WelcomeScene}
}

const navigatorConfig = {
  tabBarPosition: 'bottom'
}
