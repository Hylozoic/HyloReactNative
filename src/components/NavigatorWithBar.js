import React from 'react'
import { TabNavigator, StackNavigator } from "react-navigation"

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'
import Settings from './Settings'

const tabScreens = {
  Home: {screen: MyPosts},
  Members: {screen: WelcomeScene},
  Topics: {screen: WelcomeScene}
}

let paths = {
  Post: {screen: Post},
  MyPosts: {screen: MyPosts},
  WelcomeScene: {screen: WelcomeScene}
}

const navigatorConfig = {
  tabBarPosition: 'bottom'
}

const stackNavigators = {};
const routeConfigs = {};
console.log('keys');
console.log(Object.keys(tabScreens))
for (const key of Object.keys(tabScreens)) {
    const obj = {};
    obj[key] = tabScreens[key];
    const tabPaths = Object.assign({}, ...[obj, paths]);
    const tabConfigs = {
      initialRouteName: key
    }
    stackNavigators[`${key}Navigator`] = StackNavigator(tabPaths, tabConfigs);
    routeConfigs[key] = { screen: stackNavigators[`${key}Navigator`]};
}

const NavigatorWithBar = TabNavigator(routeConfigs, navigatorConfig);
export default NavigatorWithBar;
