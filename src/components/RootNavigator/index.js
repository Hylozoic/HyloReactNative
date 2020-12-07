import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsync } from 'react-async-hook'
import 'react-native-gesture-handler' // is this necessary?
import { Dimensions } from 'react-native'
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'
import { MAIN_ROUTE_NAME, MAIN_ROUTE_PATH } from 'util/navigation'
import Loading, { LoadingScreen } from '../Loading'
import LoadingModal from '../LoadingModal'
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
        title: get('state.params.communityName', route)
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
    <App.Screen name='PostDetails' component={PostDetails} path='post/:id' />
    <App.Screen name='ProjectMembers' component={ProjectMembers} />
    <App.Screen name='ItemChooserScreen' component={ItemChooserScreen} />
    <App.Screen name='UserSettings' component={UserSettings} />
    <App.Screen name='InvitePeople' component={InvitePeople} />
    <App.Screen name='ModeratorSettings' component={ModeratorSettings} />
    <App.Screen name='CommunitySettingsMenu' component={CommunitySettingsMenu} />
    <App.Screen name='CommunitySettings' component={CommunitySettings} />
    <App.Screen name='PasswordReset' component={UserSettings} path='settings/password' />
    <App.Screen name='NotificationsList' component={NotificationsList} />
    <App.Screen name='ThreadList' component={ThreadList} />
    <App.Screen name='ThreadParticipants' component={ThreadParticipants} />
    <App.Screen name='TopicSupportComingSoon' component={TopicSupportComingSoon} />
    <App.Screen name='InviteExpired' component={InviteExpired} />
    <App.Screen name='Signup' component={Signup} />
    <App.Screen name='SignupFlow1' component={SignupFlow1} />
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
    <App.Screen name='BlockedUsers' component={BlockedUsers} />
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
  return <Auth.Navigator initialRouteName='Login'>
    <Auth.Screen name='Login' component={Login} path='login' />
    {/* <Auth.Screen name='LoginByPasswordResetToken' component={Login} path='passwordResetTokenLogin/:userId/:loginToken/:nextURL' /> */}
    <Auth.Screen name='ForgotPassword' component={ForgotPassword} path='reset-password' />
  </Auth.Navigator>
}


import { getSessionCookie } from '../../util/session'

export const CHECK_SESSION = 'CHECK_SESSION'

export function checkSession () {
  return {
    type: CHECK_SESSION,
    // there's a harmless but confusing bug due to this promise payload that
    // returns an api payload: CHECK_SESSION_PENDING will get fired twice
    payload: getSessionCookie().then(cookie => {
      if (!cookie) return false

      return {
        api: {
          path: '/noo/user/status',
          transform: json => !!json.signedIn
        }
      }
    })
  }
}

export async function sessionCheck (dispatch) {
  return dispatch[0](checkSession)
}

export default function RootNavigator () {
  const { loading } = useAsync(sessionCheck, [useDispatch()])
  const hasSession = useSelector(state => state.session.loggedIn)

  if (loading) return <LoadingModal />

  return <NavigationContainer>
    {hasSession
      ? <AppWithDrawerNavigator />
      : <AuthNavigator />}
  </NavigationContainer>
}
