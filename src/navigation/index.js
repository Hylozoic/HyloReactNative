import 'react-native-gesture-handler' // is this necessary?
import * as React from 'react'
import { Dimensions } from 'react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { get } from 'lodash/fp'
import { isIOS } from 'util/platform'
// Helpers
import createNavigationOptionsForHeader from 'navigation/Tabs/Header/createNavigationOptionsForHeader'
import header from 'navigation/header'
import TabIcon from 'navigation/Tabs/TabIcon'
import TabLabel from 'navigation/Tabs/TabLabel'
import tabStyles from 'navigation/Tabs/Tabs.styles'
// Screens
import BlockedUsers from 'navigation/BlockedUsers'
import CommunitySettingsMenu from 'navigation/CommunitySettingsMenu'
import CommunitySettings from 'navigation/CommunitySettings'
import CreateCommunityName from 'navigation/CreateCommunityFlow/CreateCommunityName'
import CreateCommunityReview from 'navigation/CreateCommunityFlow/CreateCommunityReview'
import CreateCommunityUrl from 'navigation/CreateCommunityFlow/CreateCommunityUrl'
import DrawerMenu from 'navigation/DrawerMenu'
import Feed from 'navigation/Feed'
import ForgotPassword from 'navigation/ForgotPassword'
import InviteExpired from 'navigation/InviteExpired'
import InvitePeople from 'navigation/InvitePeople'
import ItemChooserScreen from 'navigation/ItemChooserScreen'
import JoinCommunity from 'navigation/JoinCommunity'
import LoadingScreen from 'navigation/LoadingScreen'
import Login from 'navigation/Login'
import MemberProfile from 'navigation/MemberProfile'
import MemberDetails from 'navigation/MemberProfile/MemberDetails'
import Members from 'navigation'
import MemberSkillEditor from 'navigation/MemberProfile/MemberSkillEditor'
import ModeratorSettings from 'navigation/ModeratorSettings'
import NotificationSettings from 'navigation/NotificationSettings'
import NotificationsList from 'navigation/NotificationsList'
import NewMessage from 'navigation/NewMessage'
import PostDetails from 'navigation/PostDetails'
import PostEditor from 'navigation/PostEditor'
import ProjectMembers from 'navigation/ProjectMembers'
import Projects from 'navigation'
import Thread from 'navigation/Thread'
import ThreadList from 'navigation/ThreadList'
import ThreadParticipants from 'navigation/ThreadParticipants'
import Topics from 'navigation'
import TopicSupportComingSoon from 'navigation/TopicSupportComingSoon'
import SearchPage from 'navigation/SearchPage'
import Signup from 'navigation/Signup'
import SignupFlow1 from 'navigation/SignupFlow/SignupFlow1'
import SignupFlow2 from 'navigation/SignupFlow/SignupFlow2'
import SignupFlow3 from 'navigation/SignupFlow/SignupFlow3'
import SignupFlow4 from 'navigation/SignupFlow/SignupFlow4'
import SignupFlow5 from 'navigation/SignupFlow/SignupFlow5'
import UserSettings from 'navigation/UserSettings'

const Tabs = createBottomTabNavigator()
function TabsNavigator () {
  const navigatorProps = {
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      pressColor: '#DCDCDC',
      indicatorStyle: { backgroundColor: 'white' },
      style: isIOS ? tabStyles.tabNavigatorIOS : tabStyles.tabNavigatorAndroid
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused }) =>
        <TabIcon name={route.name} focused={focused} />,
      tabBarLabel: ({ focused }) =>
        <TabLabel name={route.name} focused={focused} />
    })
  }

  return (
    <Tabs.Navigator {...navigatorProps}>
      <Tabs.Screen name='Home' component={Feed} />
      <Tabs.Screen name='Members' component={Members} />
      <Tabs.Screen name='Topics' component={Topics} />
      <Tabs.Screen name='Projects' component={Projects} />
    </Tabs.Navigator>
  )
}

const App = createStackNavigator()
function AppNavigator () {
  const navigatorProps = {
    mode: 'modal',
    headerMode: 'screen',
    screenOptions: ({ route }) => ({
      cardStyle: { backgroundColor: '#FFF' }
    })
  }

  return (
    <App.Navigator {...navigatorProps}>
      <App.Screen
        name='Main'
        component={TabsNavigator}
        options={({ navigation, route, params }) => ({
          ...createNavigationOptionsForHeader(navigation, getFocusedRouteNameFromRoute(route))
        })}
      />
      {/* Screens as modals outside of Tabs */}
      <App.Screen
        name='TopicFeed'
        component={Feed}
        options={({ route }) => ({
          title: get('params.communityName', route)
        })}
      />
      <App.Screen
        name='Feed'
        component={Feed}
        options={({ route }) => ({
          // Don't allow opening feed of current community or network in this modal?
          // Back button title should simply say Back?
          title: ''
        })}
      />
      <App.Screen
        name='MemberProfile'
        component={MemberProfile}
        options={({ route }) => ({
          // Don't allow opening feed of current community or network in this modal?
          // Back button title should simply say Back?
          title: ''
        })}
      />
      <App.Screen name='MemberDetails' component={MemberDetails} />
      <App.Screen name='MemberSkillEditor,' component={MemberSkillEditor} />
      <App.Screen name='NewMessage' component={NewMessage} />
      <App.Screen name='PostEditor' component={PostEditor} />
      <App.Screen name='PostDetails' component={PostDetails} options={{ title: 'Detail' }} />
      <App.Screen name='ProjectMembers' component={ProjectMembers} />
      <App.Screen name='ItemChooserScreen' component={ItemChooserScreen} />
      <App.Screen name='UserSettings' component={UserSettings} />
      <App.Screen name='InvitePeople' component={InvitePeople} />
      <App.Screen name='ModeratorSettings' component={ModeratorSettings} />
      <App.Screen name='CommunitySettingsMenu' component={CommunitySettingsMenu} />
      <App.Screen name='CommunitySettings' component={CommunitySettings} />
      <App.Screen
        name='NotificationsList'
        component={NotificationsList}
        options={({ navigation, route }) =>
          header(navigation, route, { left: 'close', title: 'Notifications' })}
      />
      <App.Screen name='ThreadList' component={ThreadList} options={ThreadList.navigationOptions} />
      <App.Screen name='ThreadParticipants' component={ThreadParticipants} />
      <App.Screen name='TopicSupportComingSoon' component={TopicSupportComingSoon} />
      <App.Screen name='InviteExpired' component={InviteExpired} />
      <App.Screen name='SignupFlow2' component={SignupFlow2} />
      <App.Screen name='SignupFlow3' component={SignupFlow3} />
      <App.Screen name='SignupFlow4' component={SignupFlow4} />
      <App.Screen name='SignupFlow5' component={SignupFlow5} />
      <App.Screen name='Thread' component={Thread} path='thread/:id' />
      <App.Screen name='JoinCommunity' component={JoinCommunity} />
      <App.Screen name='Loading' component={LoadingScreen} />
      <App.Screen name='CreateCommunityName' component={CreateCommunityName} />
      <App.Screen name='CreateCommunityUrl' component={CreateCommunityUrl} />
      <App.Screen name='CreateCommunityReview' component={CreateCommunityReview} />
      <App.Screen name='NotificationSettings' component={NotificationSettings} options={{ title: 'Notification Settings' }} />
      <App.Screen name='BlockedUsers' component={BlockedUsers} options={{ title: 'Blocked Users' }} />
      <App.Screen name='SearchPage' component={SearchPage} />
    </App.Navigator>
  )
}

const AppWithDrawer = createDrawerNavigator()
function AppWithDrawerNavigator () {
  const navigatorProps = {
    hideStatusBar: true,
    drawerType: 'front',
    drawerStyle: {
      width: Dimensions.get('window').width * 0.9
    },
    drawerContent: props => <DrawerMenu {...props} />
  }

  return (
    <AppWithDrawer.Navigator {...navigatorProps}>
      <AppWithDrawer.Screen name='AppNavigator' component={AppNavigator} />
    </AppWithDrawer.Navigator>
  )
}

const Auth = createStackNavigator()
function AuthNavigator () {
  return (
    <Auth.Navigator headerMode='screen'>
      <Auth.Screen name='Login' component={Login} options={{ animationEnabled: false }} />
      <Auth.Screen name='ForgotPassword' component={ForgotPassword} path='reset-password' />
      <App.Screen name='Signup' component={Signup} options={{ headerMode: 'screen' }} />
      <App.Screen name='SignupFlow1' component={SignupFlow1} />
    </Auth.Navigator>
  )
}

export default function RootNavigator ({ isSignedIn }) {
  return isSignedIn
    ? <AppWithDrawerNavigator />
    : <AuthNavigator />
}
