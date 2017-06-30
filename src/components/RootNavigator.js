import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
} from 'react-navigation'

import WelcomeScene from './WelcomeScene'
import Feed from './Feed'
import Post from './Post'
import Settings from './Settings'
import DrawerMenu from './DrawerMenu'
import { Home, Members, Topics } from './Tabs'

const tabs = {
  Home: {screen: Home},
  Members: {screen: Members},
  Topics: {screen: Topics}
}

const screens = {
  Post: {screen: Post},
  Feed: {screen: Feed},
  WelcomeScene: {screen: WelcomeScene},
  Settings: {screen: Settings}
}

Object.freeze(tabs)
Object.freeze(screens)

const tabNavigatorConfig = {
  tabBarPosition: 'bottom'
}

const TabNavigatorWithBar = TabNavigator(
  stacksInTabsFactory(tabs, screens),
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

function stacksInTabsFactory (tabs, screens) {
  // merge tabs and scenes
  // add configuration options for each scene
  // create a StackNavigator for each tab
  // return an object that can be passed into TabNavigator
  const routeConfigs = {}
  for (const key of Object.keys(tabs)) {
    const obj = {}
    obj[key] = tabs[key]
    routeConfigs[key] = {screen: stackNavigatorFactory(obj, screens, key)}
  }
  return routeConfigs
}

function stackNavigatorFactory (tabObject, otherScreens, tabName) {
  const paths = Object.assign({}, ...[tabObject, otherScreens])
  const config = {
    initialRouteName: tabName,
    navigationOptions: {
      title: tabName
    }
  }

  const stackNavigator = StackNavigator(
    paths,
    config
  )

  return stackNavigator
}
