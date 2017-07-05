import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
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
import PostDetails from '../PostDetails'

const tabs = {
  Home: {screen: Home},
  Members: {screen: Members},
  Topics: {screen: Topics}
}

const screens = {
  Post: {screen: Post},
  Feed: {screen: Feed},
  WelcomeScene: {screen: WelcomeScene},
  PostEditor: {screen: PostEditor},
  DetailsEditor: {screen: DetailsEditor},
  PostDetails: {screen: PostDetails}
}

Object.freeze(tabs)
Object.freeze(screens)

const tabNavigatorConfig = {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    indicatorStyle: {
      display: 'none'
    },
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0.4
    }
  }
}

const TabNavigatorWithBar = TabNavigator(
  stacksInTabsFactory(tabs, screens),
  tabNavigatorConfig
)

const drawerNavigatorRoutes = {
  Home: { screen: TabNavigatorWithBar }
}

const drawerNavigatorConfig = {
  contentComponent: DrawerMenu,
  initialRouteName: 'Home'
}

const DrawerAndTabsNavigator = DrawerNavigator(
  drawerNavigatorRoutes,
  drawerNavigatorConfig
)

const rootNavigatorRoutes = {
  Main: {
    screen: DrawerAndTabsNavigator,
    navigationOptions: {
      header: null
    }
  },
  Settings: {screen: Settings}
}

const rootNavigatorConfig = {

}

const RootNavigator = StackNavigator(
  rootNavigatorRoutes,
  rootNavigatorConfig
)
export default RootNavigator
