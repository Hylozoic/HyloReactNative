import {
  DrawerNavigator,
  TabNavigator,
  StackNavigator
} from 'react-navigation'
import { Dimensions } from 'react-native'
import { LoadingScreen } from '../Loading'
import SessionCheck from '../SessionCheck'
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
import ThreadParticipants from '../ThreadParticipants'
import TopicSupportComingSoon from '../TopicSupportComingSoon'
import MemberDetails from '../MemberProfile/MemberDetails'
import MemberSkillEditor from '../MemberProfile/MemberSkillEditor'
import UserSettings from '../UserSettings'
import SignupFlow1 from '../SignupFlow/SignupFlow1'
import SignupFlow2 from '../SignupFlow/SignupFlow2'
import SignupFlow3 from '../SignupFlow/SignupFlow3'
import SignupFlow4 from '../SignupFlow/SignupFlow4'
import SignupFlow5 from '../SignupFlow/SignupFlow5'
import Login from '../Login'
import ForgotPassword from '../ForgotPassword'
import CreateCommunityName from '../CreateCommunityFlow/CreateCommunityName'
import CreateCommunityUrl from '../CreateCommunityFlow/CreateCommunityUrl'
import CreateCommunityReview from '../CreateCommunityFlow/CreateCommunityReview'

import InviteExpired from '../InviteExpired'
import Signup from '../Signup'
import trackCurrentTab from './trackCurrentTab'
import { isIOS } from 'util/platform'
import { MAIN_ROUTE_NAME, MAIN_ROUTE_PATH } from 'util/navigation'
import TabBar from './TabBar'
import extendRouter from './extendRouter'

// If you change or add tabs you have to edit trackCurrentTab.js
const tabs = {
  Home: {screen: Home, path: ''},
  Members: {screen: Members, path: 'people'},
  Topics: {screen: Topics, path: 'topics'}
}

// Screens that can be shown in any tab (the same tab icon stays highlighted)
const screensInTabs = {
  Feed: {screen: Feed},
  PostEditor: {screen: PostEditor},
  DetailsEditor: {screen: DetailsEditor},
  PostDetails: {screen: PostDetails, path: 'post/:id'},
  MemberProfile: {screen: MemberProfile, path: 'people/:id'},
  MemberDetails: {screen: MemberDetails},
  MemberSkillEditor: {screen: MemberSkillEditor},
  CommentEditor: {screen: CommentEditor},
  NewMessage: {screen: NewMessage}
}

Object.freeze(tabs)
Object.freeze(screensInTabs)

const TabNavigatorWithBar = TabNavigator(
  stacksInTabsFactory(tabs, screensInTabs),
  {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      indicatorStyle: {display: 'none'},
      style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
    },
    // TODO remove this line once this PR is merged and released:
    // https://github.com/react-community/react-navigation/pull/1764
    tabBarComponent: TabBar
  }
)

const DrawerAndTabsNavigator = DrawerNavigator(
  {
    DrawerHome: {screen: TabNavigatorWithBar}
  },
  {
    contentComponent: DrawerMenu,
    initialRouteName: 'DrawerHome',
    drawerWidth: Dimensions.get('window').width * 0.9
  }
)

// Screens that appear outside of tabs: Settings, Messages, etc.
const screensInStack = {
  UserSettings: {screen: UserSettings},
  PasswordReset: {screen: UserSettings, path: 'settings/password'},
  NotificationsList: {screen: NotificationsList},
  ThreadList: {screen: ThreadList},
  ThreadParticipants: {screen: ThreadParticipants},
  TopicSupportComingSoon: {screen: TopicSupportComingSoon},
  SessionCheck: {screen: SessionCheck},
  InviteExpired: {screen: InviteExpired},
  Signup: {screen: Signup},
  SignupFlow1: {screen: SignupFlow1},
  SignupFlow2: {screen: SignupFlow2},
  SignupFlow3: {screen: SignupFlow3},
  SignupFlow4: {screen: SignupFlow4},
  SignupFlow5: {screen: SignupFlow5},
  Login: {screen: Login, path: 'login'},
  LoginByPasswordResetToken: {screen: Login, path: 'passwordResetTokenLogin/:userId/:loginToken/:nextURL'},
  ForgotPassword: {screen: ForgotPassword, path: 'reset-password'},
  Thread: {screen: Thread, path: 'thread/:id'},
  UseInvitation: {screen: JoinCommunity, path: 'useInvitation/:token'},
  UseAccessCode: {screen: JoinCommunity, path: 'useAccessCode/:slug/:accessCode'},
  Loading: {screen: LoadingScreen},
  CreateCommunityName: {screen: CreateCommunityName},
  CreateCommunityUrl: {screen: CreateCommunityUrl},
  CreateCommunityReview: {screen: CreateCommunityReview}
}

const RootNavigator = StackNavigator(
  {
    [MAIN_ROUTE_NAME]: {
      screen: DrawerAndTabsNavigator,
      path: MAIN_ROUTE_PATH,
      navigationOptions: {header: null}
    },
    ...screensInStack
  },
  {
    cardStyle: {backgroundColor: '#FFF'},
    mode: 'modal',
    initialRouteName: 'Loading'
  }
)

extendRouter(RootNavigator.router)

// trackCurrentTab must be on the top-level navigator, because it uses a prop
// for listening to navigation change events that can only be assigned to a
// top-level navigator
export default trackCurrentTab(RootNavigator)
