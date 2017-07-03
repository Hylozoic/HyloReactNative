import {
  DrawerNavigator,
  TabNavigator
} from 'react-navigation'

import WelcomeScene from '../WelcomeScene'
import Feed from '../Feed'
import Post from '../Post'
import Settings from '../Settings'
import DrawerMenu from '../DrawerMenu'
import { Home, Members, Topics } from '../Tabs'
import stacksInTabsFactory from './stacksInTabsFactory'
import PostEditor from '../PostEditor'
import DetailsEditor from '../PostEditor/DetailsEditor'
import PostDetails from './PostDetails'

const tabs = {
  Home: {screen: Home},
  Members: {screen: Members},
  Topics: {screen: Topics}
}

const screens = {
  Post: {screen: Post},
  Feed: {screen: Feed},
  WelcomeScene: {screen: WelcomeScene},
  Settings: {screen: Settings},
  PostEditor: {screen: PostEditor},
  DetailsEditor: {screen: DetailsEditor},
  PostDetails: {screen: PostDetails}
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
