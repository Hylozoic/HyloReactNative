import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
} from 'react-navigation'
import { Dimensions } from 'react-native'

import WelcomeScene from '../WelcomeScene'
import Feed from '../Feed'
import JoinCommunity from '../JoinCommunity'
import DrawerMenu from '../DrawerMenu'
import { Home, Members, Topics } from '../Tabs' // eslint-disable-line no-unused-vars
import stacksInTabsFactory from './stacksInTabsFactory'
import PostEditor from '../PostEditor'
import DetailsEditor from '../PostEditor/DetailsEditor'
import PostDetails from '../PostDetails'
import MemberProfile from '../MemberProfile'
import NotificationsList from '../NotificationsList'
import CommentEditor from '../PostDetails/CommentEditor'
import tabStyles from '../Tabs/Tabs.styles'
import NewMessage from '../NewMessage'
import Thread from '../Thread'
import ThreadList from '../ThreadList'
import MemberDetails from '../MemberProfile/MemberDetails'
import MemberSkillEditor from '../MemberProfile/MemberSkillEditor'
import UserSettings from '../UserSettings'
import SignupFlow1 from '../SignupFlow/SignupFlow1'
import SignupFlow2 from '../SignupFlow/SignupFlow2'
import SignupFlow3 from '../SignupFlow/SignupFlow3'
import SignupFlow4 from '../SignupFlow/SignupFlow4'
import SignupFlow5 from '../SignupFlow/SignupFlow5'
import createLinkingAwareContainer from './createLinkingAwareContainer'
import trackCurrentTab from './trackCurrentTab'
import { isIOS } from 'util/platform'
import TabBar from './TabBar'

export const urlPrefix = 'http://hylo.com/'
// Tab Home Screens
// If you change or add tabs you have to edit trackCurrentTab.js
export const tabs = {
  Home: {screen: Home, path: ''},
  Members: {screen: Members, path: 'people'}
  // Topics: {screen: Topics, path: 'topics'} // TODO
}

// Screens that work within Tabs (the same tab icon stays highlighted)
export const screensInTabs = {
  Feed: {screen: Feed, path: 'feed'},
  WelcomeScene: {screen: WelcomeScene, path: 'welcome'},
  PostEditor: {screen: PostEditor, path: 'post/:id/edit'},
  DetailsEditor: {screen: DetailsEditor, path: 'details/:id/edit'},
  PostDetails: {screen: PostDetails, path: 'post/:id'},
  MemberProfile: {screen: MemberProfile, path: 'people/:id'},
  MemberDetails: {screen: MemberDetails, path: 'people/:id/details'},
  MemberSkillEditor: {screen: MemberSkillEditor, path: 'people/:id/skills'},
  CommentEditor: {screen: CommentEditor, path: 'comment/:postId/new'},
  NewMessage: {screen: NewMessage}
}

// Screens that work outside of tabs, Settings, Messages, etc.
export const screensInStack = {
  UserSettings: {screen: UserSettings, path: 'settings'},
  JoinCommunity: {screen: JoinCommunity, path: 'h/use-invitation'},
  JoinCommunityAccessCode: {screen: JoinCommunity, path: 'c/:slug/join/:accessCode'},
  Thread: {screen: Thread, path: 'thread/:id'},
  NotificationsList: {screen: NotificationsList, path: 'notifications'},
  ThreadList: {screen: ThreadList, path: 'messages'},
  SignupFlow1: {screen: SignupFlow1, path: 'signup/1'},
  SignupFlow2: {screen: SignupFlow2, path: 'signup/2'},
  SignupFlow3: {screen: SignupFlow3, path: 'signup/3'},
  SignupFlow4: {screen: SignupFlow4, path: 'signup/4'},
  SignupFlow5: {screen: SignupFlow5, path: 'signup/5'}
}

Object.freeze(tabs)
Object.freeze(screensInTabs)

const tabNavigatorConfig = {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  lazy: true,
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    indicatorStyle: {
      display: 'none'
    },
    style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
  },
  // TODO remove this line once this PR is merged and released:
  // https://github.com/react-community/react-navigation/pull/1764
  tabBarComponent: TabBar
}

const TabNavigatorWithBar = TabNavigator(
  stacksInTabsFactory(tabs, screensInTabs),
  tabNavigatorConfig
)

const drawerNavigatorRoutes = {
  DrawerHome: {
    screen: createLinkingAwareContainer(TabNavigatorWithBar, urlPrefix)
  }
}

const drawerNavigatorConfig = {
  contentComponent: DrawerMenu,
  initialRouteName: 'DrawerHome',
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
    cardStyle: {backgroundColor: '#FFF'},
    mode: 'modal'
  }
)

// trackCurrentTab must be on the top-level navigator, because it uses a prop
// for listening to navigation change events that can only be assigned to a
// top-level navigator
export default trackCurrentTab(RootNavigator)
