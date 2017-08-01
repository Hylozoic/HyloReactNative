import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
} from 'react-navigation'
import { Dimensions } from 'react-native'

import WelcomeScene from '../WelcomeScene'
import Feed from '../Feed'
import Settings from '../Settings'
import DrawerMenu from '../DrawerMenu'
import { Home, Members, Topics } from '../Tabs'
import stacksInTabsFactory from './stacksInTabsFactory'
import PostEditor from '../PostEditor'
import DetailsEditor from '../PostEditor/DetailsEditor'
import PostDetails from '../PostDetails'
import MemberProfile from '../MemberProfile'
import CommentEditor from '../PostDetails/CommentEditor'
import tabStyles from '../Tabs/Tabs.styles'
import NewMessage from '../NewMessage'
import ThreadList from '../ThreadList'
import createLinkingAwareContainer from './createLinkingAwareContainer'
import { isIOS } from 'util/platform'

// Tab Home Screens
const tabs = {
  Home: {screen: Home, path: ''},
  Members: {screen: Members, path: 'people'},
  Topics: {screen: Topics, path: 'topics'}
}

// Screens that work within Tabs (the same tab icon stays highlighted)
const screensInTabs = {
  Feed: {screen: Feed, path: 'feed'},
  WelcomeScene: {screen: WelcomeScene, path: 'welcome'},
  PostEditor: {screen: PostEditor, path: 'post/:id/edit'},
  DetailsEditor: {screen: DetailsEditor, path: 'details/:id/edit'},
  PostDetails: {screen: PostDetails, path: 'post/:id'},
  MemberProfile: {screen: MemberProfile, path: 'people/:id'},
  CommentEditor: {screen: CommentEditor, path: 'comment/:postId/new'},
  NewMessage: {screen: NewMessage}
}

// Screens that work outside of tabs, Settings, Messages, etc.
const screensInStack = {
  Settings: {screen: Settings, path: 'settings'},
  ThreadList: {screen: ThreadList, path: 'messages'}
}

Object.freeze(tabs)
Object.freeze(screensInTabs)

const tabNavigatorConfig = {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    indicatorStyle: {
      display: 'none'
    },
    style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
  }
}

const TabNavigatorWithBar = TabNavigator(
  stacksInTabsFactory(tabs, screensInTabs),
  tabNavigatorConfig
)

const prefix = isIOS ? 'HyloReactNative://' : 'HyloReactNative://HyloReactNative/'

const drawerNavigatorRoutes = {
  Home: { screen: createLinkingAwareContainer(TabNavigatorWithBar, prefix) }
}

const drawerNavigatorConfig = {
  contentComponent: DrawerMenu,
  initialRouteName: 'Home',
  drawerWidth: Dimensions.get('window').width * 0.9
}

const DrawerAndTabsNavigator = DrawerNavigator(
  drawerNavigatorRoutes,
  drawerNavigatorConfig
)

const mainStackRoute = {
  Main: {
    screen: DrawerAndTabsNavigator,
    navigationOptions: {
      header: null
    }
  }
}

const rootNavigatorRoutes = Object.assign({}, mainStackRoute, screensInStack)
const RootNavigator = StackNavigator(
  rootNavigatorRoutes,
  {
    mode: 'modal'
  }
)

export default RootNavigator
