import React from 'react'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Dimensions, Text } from 'react-native'
import { LoadingScreen } from '../Loading'
import createNavigationOptionsForHeader from 'components/Tabs/Header/createNavigationOptionsForHeader'
import TabIcon from '../Tabs/TabIcon'
import TabLabel from '../Tabs/TabLabel'
import SessionCheck from '../SessionCheck'
import Feed from '../Feed'
import JoinCommunity from '../JoinCommunity'
import CommunitySettingsMenu from '../CommunitySettingsMenu'
import CommunitySettings from '../CommunitySettings'
import DrawerMenu from '../DrawerMenu'
import { Home, Members, Topics, Projects } from '../Tabs' // eslint-disable-line no-unused-vars
import PostEditor from '../PostEditor'
import PostDetails from '../PostDetails'
import ProjectMembers from '../ProjectMembers'
import ItemChooserScreen from '../ItemChooserScreen'
import MemberProfile from '../MemberProfile'
import NotificationSettings from '../NotificationSettings'
import BlockedUsers from '../BlockedUsers'
import NotificationsList from '../NotificationsList'
import InvitePeople from '../InvitePeople'
import tabStyles from '../Tabs/Tabs.styles'
import NewMessage from '../NewMessage'
import ModeratorSettings from '../ModeratorSettings'
import Thread from '../Thread'
import ThreadList from '../ThreadList'
import ThreadParticipants from '../ThreadParticipants'
import TopicSupportComingSoon from '../TopicSupportComingSoon'
import MemberDetails from '../MemberProfile/MemberDetails'
import MemberSkillEditor from '../MemberProfile/MemberSkillEditor'
import UserSettings from '../UserSettings'
import SearchPage from '../SearchPage'
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
import extendRouter from './extendRouter'

const HomeStack = createStackNavigator({
  Home: {screen: Home, path: ''},
  Feed: {screen: Feed, path: 'feed/:communityId'},
  TopicFeed: {screen: Feed, path: 'c/:communitySlugFromLink/topicFeed/:topicName'},
  CommunityFeed: {screen: Feed, path: 'communityFeed/:communitySlugFromLink'},
  NetworkFeed: {screen: Feed, path: 'networkFeed/:networkSlug'}
}, {
  defaultNavigationOptions: {
    headerShown: false
  }
})

const BottomTabs = createBottomTabNavigator({
  Home: { screen: HomeStack },
  Members: { screen: Members, path: 'people' },
  Topics: { screen: Topics, path: 'topics' },
  Projects: { screen: Projects, path: 'projects' }
}, {
  defaultNavigationOptions: ({ navigation: { state: { routeName } } }) => ({
    tabBarIcon: ({ focused }) =>
      <TabIcon name={routeName} focused={focused} />,
    tabBarLabel: ({ focused }) =>
      <TabLabel name={routeName} focused={focused} />
  }),
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    pressColor: '#DCDCDC',
    indicatorStyle: {backgroundColor: 'white'},
    style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
  },
  initialRouteName: 'Home',
  animationEnabled: false,
  swipeEnabled: false,
  lazy: true
})

const AllScreens = createStackNavigator(
  {
    [MAIN_ROUTE_NAME]: {
      screen: BottomTabs,
      path: MAIN_ROUTE_PATH,
      // defaultNavigationOptions: {
      //   headerShown: false
      // },
      navigationOptions: ({ navigation, ...params }) => ({
        ...createNavigationOptionsForHeader(navigation, 'Home')
      })
    },
    // Screens that appear outside of tabs: Settings, Messages, etc.
    MemberProfile: {screen: MemberProfile, path: 'people/:id'},
    MemberDetails,
    MemberSkillEditor,
    NewMessage,
    PostDetails: {screen: PostDetails, path: 'post/:id'},
    PostEditor,
    ProjectMembers,
    ItemChooserScreen,
    UserSettings,
    InvitePeople,
    ModeratorSettings,
    CommunitySettingsMenu,
    CommunitySettings,
    PasswordReset: {screen: UserSettings, path: 'settings/password'},
    NotificationsList,
    ThreadList,
    ThreadParticipants,
    TopicSupportComingSoon,
    SessionCheck,
    InviteExpired,
    Signup,
    SignupFlow1,
    SignupFlow2,
    SignupFlow3,
    SignupFlow4,
    SignupFlow5,
    Login: {screen: Login, path: 'login'},
    LoginByPasswordResetToken: {screen: Login, path: 'passwordResetTokenLogin/:userId/:loginToken/:nextURL'},
    ForgotPassword: {screen: ForgotPassword, path: 'reset-password'},
    Thread: {screen: Thread, path: 'thread/:id'},
    UseInvitation: {screen: JoinCommunity, path: 'useInvitation/:token'},
    UseAccessCode: {screen: JoinCommunity, path: 'useAccessCode/:slug/:accessCode'},
    Loading: LoadingScreen,
    CreateCommunityName,
    CreateCommunityUrl,
    CreateCommunityReview,
    NotificationSettings,
    BlockedUsers,
    SearchPage
  },
  {
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFF' }
    },
    navigationOptions: {
      headerShown: false
    },
    mode: 'modal',
    initialRouteName: MAIN_ROUTE_NAME
  }
)

const RootNavigator = createDrawerNavigator({
  DrawerHome: AllScreens
}, {
  contentComponent: DrawerMenu,
  initialRouteName: 'DrawerHome',
  hideStatusBar: true,
  drawerType: 'front',
  drawerWidth: Dimensions.get('window').width * 0.9
})

extendRouter(RootNavigator.router)

// trackCurrentTab must be on the top-level navigator, because it uses a prop
// for listening to navigation change events that can only be assigned to a
// top-level navigator
export default trackCurrentTab(createAppContainer(RootNavigator))
