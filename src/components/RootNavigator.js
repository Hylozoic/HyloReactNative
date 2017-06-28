import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
} from 'react-navigation'

import WelcomeScene from './WelcomeScene'
import MyPosts from './MyPosts'
import Post from './Post'
import Settings from './Settings'
import DrawerMenu from './DrawerMenu'

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

Object.freeze(tabs)
Object.freeze(screens)

const tabNavigatorConfig = {
  tabBarPosition: 'bottom'
}

const TabNavigatorWithBar = TabNavigator(
  mergeRouteConfigsByTab(tabs, screens),
  tabNavigatorConfig
)

const drawerNavigatorRoutes = {
  Home: { screen: TabNavigatorWithBar }
}

const drawerNavigatorConfig = {
  contentComponent: DrawerMenu
}

const RootNavigator = DrawerNavigator(
  drawerNavigatorRoutes,
  drawerNavigatorConfig
)

export default RootNavigator

function mergeRouteConfigsByTab (tabs, screens) {
  // merge tabs and scenes
  // add configuration options for each scene
  // create a StackNavigator for each tab
  // return an object that can be passed into TabNavigator
  const stackNavigators = {}
  const routeConfigs = {}
  for (const key of Object.keys(tabs)) {
    const obj = {}
    obj[key] = tabs[key]
    const stackPaths = Object.assign({}, ...[obj, screens])
    const sceneConfigs = {
      initialRouteName: key,
      navigationOptions: {
        title: key
      }
    }
    stackNavigators[`${key}Navigator`] = StackNavigator(
        stackPaths, sceneConfigs
      )
    routeConfigs[key] = {screen: stackNavigators[`${key}Navigator`]}
  }
  return routeConfigs
}
