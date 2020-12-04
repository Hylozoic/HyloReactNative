import React from 'react'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Dimensions, Text } from 'react-native'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { MAIN_ROUTE_NAME, MAIN_ROUTE_PATH } from 'util/navigation'
// import extendRouter from './extendRouter'
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

const TabsNavigator = createBottomTabNavigator({
  Home: createStackNavigator({
    // Once deep linking is re-done Flatten these into a single scren that handles the routing?
    Home: { screen: Home, path: '', navigationOptions: { headerShown: false } },
    CommunityFeed: { screen: Feed, path: 'communityFeed/:communitySlugFromLink' },
    NetworkFeed: { screen: Feed, path: 'networkFeed/:networkSlug' }
  }),
  Members: { screen: Members, path: 'people' },
  Topics: { screen: Topics, path: 'topics' },
  Projects: { screen: Projects, path: 'projects' }
}, {
  navigationOptions: ({ navigation }) => ({
    ...createNavigationOptionsForHeader(
      navigation,
      navigation.state.routes[navigation.state.index].key
    )
  }),
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

const AppScreensNavigator = createStackNavigator(
  {
    [MAIN_ROUTE_NAME]: { screen: TabsNavigator, path: MAIN_ROUTE_PATH },
    TopicFeed: {
      screen: Feed,
      path: 'c/:communitySlugFromLink/topicFeed/:topicName',
      navigationOptions: ({ navigation }) => ({
        title: get('state.params.communityName', navigation)
      })
    },
    Feed: {
      screen: Feed,
      path: 'feed/:communityId',
      navigationOptions: ({ navigation }) => ({
        // Don't allow opening feed of current community or network in this modal?
        // Back button title should simply say Back?
        title: ''
      })
    },

    // Screens that appear outside of tabs: Settings, Messages, etc.  
    MemberProfile: { screen: MemberProfile, path: 'people/:id' },
    MemberDetails,
    MemberSkillEditor,
    NewMessage,
    PostDetails: { screen: PostDetails, path: 'post/:id' },
    PostEditor,
    ProjectMembers,
    ItemChooserScreen,
    UserSettings,
    InvitePeople,
    ModeratorSettings,
    CommunitySettingsMenu,
    CommunitySettings,
    PasswordReset: { screen: UserSettings, path: 'settings/password' },
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
    Thread: { screen: Thread, path: 'thread/:id' },
    UseInvitation: { screen: JoinCommunity, path: 'useInvitation/:token' },
    UseAccessCode: { screen: JoinCommunity, path: 'useAccessCode/:slug/:accessCode' },
    Loading: LoadingScreen,
    CreateCommunityName,
    CreateCommunityUrl,
    CreateCommunityReview,
    NotificationSettings,
    BlockedUsers,
    SearchPage
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      cardStyle: { backgroundColor: '#FFF' }
    }),
    mode: 'modal',
    initialRouteName: MAIN_ROUTE_NAME
  }
)

const AppNavigator = createDrawerNavigator({
  DrawerHome: AppScreensNavigator
}, {
  contentComponent: DrawerMenu,
  initialRouteName: 'DrawerHome',
  hideStatusBar: true,
  drawerType: 'front',
  drawerWidth: Dimensions.get('window').width * 0.9
})

const AuthNavigator = createStackNavigator({
  Login: { screen: Login, path: 'login' },
  LoginByPasswordResetToken: { screen: Login, path: 'passwordResetTokenLogin/:userId/:loginToken/:nextURL' },
  ForgotPassword: { screen: ForgotPassword, path: 'reset-password' }
}, {
  initialRouteName: 'Login'
})

// extendRouter(RootNavigator.router)
export default createAppContainer(createSwitchNavigator({
  SessionCheck,
  AuthNavigator,
  AppNavigator
}, {
  initialRouteName: 'SessionCheck'
}))
