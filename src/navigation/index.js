import 'react-native-gesture-handler' // is this necessary?
import * as React from 'react'
import { Dimensions } from 'react-native'
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { MAIN_ROUTE_NAME, MAIN_ROUTE_PATH } from 'navigation/routing'
import { LoadingScreen } from 'components/Loading'
import createNavigationOptionsForHeader from 'components/Tabs/Header/createNavigationOptionsForHeader'
import TabIcon from 'components/Tabs/TabIcon'
import TabLabel from 'components/Tabs/TabLabel'
import Feed from 'components/Feed'
import JoinCommunity from 'components/JoinCommunity'
import CommunitySettingsMenu from 'components/CommunitySettingsMenu'
import CommunitySettings from 'components/CommunitySettings'
import DrawerMenu from 'components/DrawerMenu'
import { Home, Members, Topics, Projects } from 'components/Tabs' // eslint-disable-line no-unused-vars
import PostEditor from 'components/PostEditor'
import PostDetails from 'components/PostDetails'
import ProjectMembers from 'components/ProjectMembers'
import ItemChooserScreen from 'components/ItemChooserScreen'
import MemberProfile from 'components/MemberProfile'
import NotificationSettings from 'components/NotificationSettings'
import BlockedUsers from 'components/BlockedUsers'
import NotificationsList from 'components/NotificationsList'
import InvitePeople from 'components/InvitePeople'
import tabStyles from 'components/Tabs/Tabs.styles'
import NewMessage from 'components/NewMessage'
import ModeratorSettings from 'components/ModeratorSettings'
import Thread from 'components/Thread'
import ThreadList from 'components/ThreadList'
import ThreadParticipants from 'components/ThreadParticipants'
import TopicSupportComingSoon from 'components/TopicSupportComingSoon'
import MemberDetails from 'components/MemberProfile/MemberDetails'
import MemberSkillEditor from 'components/MemberProfile/MemberSkillEditor'
import UserSettings from 'components/UserSettings'
import SearchPage from 'components/SearchPage'
import SignupFlow1 from 'components/SignupFlow/SignupFlow1'
import SignupFlow2 from 'components/SignupFlow/SignupFlow2'
import SignupFlow3 from 'components/SignupFlow/SignupFlow3'
import SignupFlow4 from 'components/SignupFlow/SignupFlow4'
import SignupFlow5 from 'components/SignupFlow/SignupFlow5'
import Login from 'components/Login'
import ForgotPassword from 'components/ForgotPassword'
import CreateCommunityName from 'components/CreateCommunityFlow/CreateCommunityName'
import CreateCommunityUrl from 'components/CreateCommunityFlow/CreateCommunityUrl'
import CreateCommunityReview from 'components/CreateCommunityFlow/CreateCommunityReview'
import InviteExpired from 'components/InviteExpired'
import Signup from 'components/Signup'

const HomeStack = createStackNavigator()
function HomeStackNavigator () {
  return <HomeStack.Navigator>
    <HomeStack.Screen name='Home' component={Home} options={{ headerShown: false }} path='/' />
    <HomeStack.Screen name='Feed' component={Feed} path='communityFeed/:communitySlugFromLink' />
    {/* <HomeStack.Screen name='Feed' component={Feed} path='networkFeed/:networkSlug' /> */}
  </HomeStack.Navigator>
}

const Tabs = createBottomTabNavigator()
function TabsNavigator () {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) =>
      <TabIcon name={route.name} focused={focused} />,
    tabBarLabel: ({ focused }) =>
      <TabLabel name={route.name} focused={focused} />
  })
  const tabBarOptions = {
    showIcon: true,
    showLabel: true,
    pressColor: '#DCDCDC',
    indicatorStyle: {backgroundColor: 'white'},
    style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
  }

  return <Tabs.Navigator
    screenOptions={screenOptions}
    tabBarOptions={tabBarOptions}>
    <Tabs.Screen name='Home' component={HomeStackNavigator} path='/' />
    <Tabs.Screen name='Members' component={Members} path='people' />
    <Tabs.Screen name='Topics' component={Topics} path='topics' />
    <Tabs.Screen name='Projects' component={Projects} path='projects' />
  </Tabs.Navigator>
}

const App = createStackNavigator()
function AppNavigator () {
  const screenOptions = ({ route }) => ({
    cardStyle: { backgroundColor: '#FFF' }
  })

  return <App.Navigator
    screenOptions={screenOptions}
    initialRouteName={MAIN_ROUTE_NAME}
    mode='modal'
    headerMode='screen'>
    <App.Screen
      name={MAIN_ROUTE_NAME}
      component={TabsNavigator}
      path={MAIN_ROUTE_PATH}
      options={({ navigation, route, params }) => ({
        ...createNavigationOptionsForHeader(navigation, getFocusedRouteNameFromRoute(route))
      })}
    /> 
    <App.Screen
      name='TopicFeed'
      component={Feed}
      path='c/:communitySlugFromLink/topicFeed/:topicName'
      options={({ route }) => ({
        title: get('params.communityName', route)
      })}
    />
    <App.Screen
      name='Feed'
      component={Feed}
      path='feed/:communityId'
      options={({ route }) => ({
        // Don't allow opening feed of current community or network in this modal?
        // Back button title should simply say Back?
        title: ''
      })}
    />
    {/* Screens that appear outside of tabs: Settings, Messages, etc.   */}
    <App.Screen
      name='MemberProfile'
      component={MemberProfile}
      path='people/:id'
      options={({ route }) => ({
        // Don't allow opening feed of current community or network in this modal?
        // Back button title should simply say Back?
        title: ''
      })}
    />
    <App.Screen name='MemberDetails' component={MemberDetails} />
    <App.Screen name='MemberSkillEditor,' component={MemberSkillEditor} />
    <App.Screen name='NewMessage' component={NewMessage} />
    <App.Screen name='PostEditor' component={PostEditor} path='post/:id' />
    <App.Screen name='PostDetails' component={PostDetails} options={{ title: 'Detail' }} path='post/:id' />
    <App.Screen name='ProjectMembers' component={ProjectMembers} />
    <App.Screen name='ItemChooserScreen' component={ItemChooserScreen} />
    <App.Screen name='UserSettings' component={UserSettings} />
    <App.Screen name='InvitePeople' component={InvitePeople} />
    <App.Screen name='ModeratorSettings' component={ModeratorSettings} />
    <App.Screen name='CommunitySettingsMenu' component={CommunitySettingsMenu} />
    <App.Screen name='CommunitySettings' component={CommunitySettings} />
    <App.Screen name='PasswordReset' component={UserSettings} path='settings/password' />
    <App.Screen name='NotificationsList' component={NotificationsList} />
    <App.Screen name='ThreadList' component={ThreadList} options={ThreadList.navigationOptions} />
    <App.Screen name='ThreadParticipants' component={ThreadParticipants} />
    <App.Screen name='TopicSupportComingSoon' component={TopicSupportComingSoon} />
    <App.Screen name='InviteExpired' component={InviteExpired} />
    <App.Screen name='SignupFlow2' component={SignupFlow2} />
    <App.Screen name='SignupFlow3' component={SignupFlow3} />
    <App.Screen name='SignupFlow4' component={SignupFlow4} />
    <App.Screen name='SignupFlow5' component={SignupFlow5} />
    <App.Screen name='Thread' component={Thread} path='thread/:id' />
    <App.Screen name='UseInvitation' component={JoinCommunity} path='useInvitation/:token' />
    {/* <App.Screen name='UseAccessCode' component={JoinCommunity} path='useAccessCode/:slug/:accessCode' /> */}
    <App.Screen name='Loading' component={LoadingScreen} />
    <App.Screen name='CreateCommunityName' component={CreateCommunityName} />
    <App.Screen name='CreateCommunityUrl' component={CreateCommunityUrl} />
    <App.Screen name='CreateCommunityReview' component={CreateCommunityReview} />
    <App.Screen name='NotificationSettings' component={NotificationSettings} />
    <App.Screen name='BlockedUsers' component={BlockedUsers} options={BlockedUsers.navigationOptions} />
    <App.Screen name='SearchPage' component={SearchPage} />
  </App.Navigator>
}

const AppWithDrawer = createDrawerNavigator()
function AppWithDrawerNavigator () {
  return <AppWithDrawer.Navigator
    drawerContent={props => <DrawerMenu {...props} />}
    hideStatusBar
    drawerType='front'
    drawerWidth={Dimensions.get('window').width * 0.9}>
    <AppWithDrawer.Screen name='DrawerHome' component={AppNavigator} />
  </AppWithDrawer.Navigator>
}

const Auth = createStackNavigator()
function AuthNavigator () {
  return <Auth.Navigator initialRouteName='Login' headerMode='screen'>
    <Auth.Screen name='Login' component={Login} path='login' />
    {/* <Auth.Screen name='LoginByPasswordResetToken' component={Login} path='passwordResetTokenLogin/:userId/:loginToken/:nextURL' /> */}
    <Auth.Screen name='ForgotPassword' component={ForgotPassword} path='reset-password' />
    <App.Screen name='Signup' component={Signup} options={{ headerMode: 'screen' }} />
    <App.Screen name='SignupFlow1' component={SignupFlow1} />
  </Auth.Navigator>
}

export default function RootNavigator ({ isSignedIn }) {
  return <NavigationContainer>
    {isSignedIn
      ? <AppWithDrawerNavigator />
      : <AuthNavigator />}
  </NavigationContainer>
}
