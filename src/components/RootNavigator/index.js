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
import Thread from '../Thread'
import ThreadList from '../ThreadList'
import MemberDetails from '../MemberProfile/MemberDetails'
import Signup from '../Signup'
import SignupFlow1 from '../SignupFlow/SignupFlow1'
import createLinkingAwareContainer from './createLinkingAwareContainer'
import trackCurrentTab from './trackCurrentTab'
import { isIOS, urlPrefix } from 'util/platform'

// Tab Home Screens
// If you change or add tabs you have to edit trackCurrentTab.js
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
  MemberDetails: {screen: MemberDetails, path: 'people/:id/details'},
  CommentEditor: {screen: CommentEditor, path: 'comment/:postId/new'},
  NewMessage: {screen: NewMessage},
  Signup: {screen: Signup, path: 'signup'},
  SignupFlow1: {screen: SignupFlow1, path: 'signup/1'}
}

// Screens that work outside of tabs, Settings, Messages, etc.
const screensInStack = {
  Settings: {screen: Settings, path: 'settings'},
  Thread: {screen: Thread, path: 'thread/:id'},
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

const drawerNavigatorRoutes = {
  Home: {
    screen: createLinkingAwareContainer(TabNavigatorWithBar, urlPrefix)
  }
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

// trackCurrentTab must be on the top-level navigator, because it uses a prop
// for listening to navigation change events that can only be assigned to a
// top-level navigator
export default trackCurrentTab(RootNavigator)
