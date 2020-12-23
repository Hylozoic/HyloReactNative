import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { isFunction } from 'lodash/fp'
import { buildModalScreenOptions, buildWorkflowModalScreenOptions  } from 'navigation/header'
// Navigation
import TabsNavigator from 'navigation/TabsNavigator'
// Screens
import BlockedUsers from 'screens/BlockedUsers'
import CommunitySettingsMenu from 'screens/CommunitySettingsMenu'
import CommunitySettingsComponent from 'screens/CommunitySettings'
import CreateCommunityName from 'screens/CreateCommunityFlow/CreateCommunityName'
import CreateCommunityReview from 'screens/CreateCommunityFlow/CreateCommunityReview'
import CreateCommunityUrl from 'screens/CreateCommunityFlow/CreateCommunityUrl'
import InviteExpired from 'screens/InviteExpired'
import InvitePeople from 'screens/InvitePeople'
import ItemChooserScreen from 'screens/ItemChooserScreen'
import JoinCommunity from 'screens/JoinCommunity'
import LoadingScreen from 'screens/LoadingScreen'
import ModeratorSettings from 'screens/ModeratorSettings'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import NewMessage from 'screens/NewMessage'
import PostEditor from 'screens/PostEditor'
import Thread from 'screens/Thread'
import ThreadList from 'screens/ThreadList'
import ThreadParticipants from 'screens/ThreadParticipants'
import SearchPage from 'screens/SearchPage'
import UserSettings from 'screens/UserSettings'

const Messages = createStackNavigator()
export function MessagesNavigator () {
  const navigatorProps = {
    screenOptions: buildModalScreenOptions({
      headerLeftCloseIcon: false,
      headerBackTitleVisible: false
    })
  }
  return (
    <Messages.Navigator {...navigatorProps}>
      <Messages.Screen name='Messages' component={ThreadList}
        options={({ navigation }) => buildModalScreenOptions({
          headerRightButtonLabel: 'New',
          headerRightButtonOnPress: () => navigation.navigate('New Message')
        })} />
      <Messages.Screen name='New Message' component={NewMessage} />
      <Messages.Screen name='ThreadParticipants' component={ThreadParticipants}
      options={{ headerTitle: 'Participants' }} />
      <Messages.Screen name='Thread' component={Thread}
        options={({ navigation }) => buildModalScreenOptions({
          headerLeftCloseIcon: false,
          headerLeftOnPress: () => navigation.navigate('Messages')
        })} />
    </Messages.Navigator>
  )
}

const CreateCommunity = createStackNavigator()
export function CreateCommunityNavigator () {
  const navigatorProps = {}
  return (
    <CommunitySettings.Navigator {...navigatorProps}>
      <CommunitySettings.Screen name='CreateCommunityName' component={CreateCommunityName}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 1/3', headerLeftCloseIcon: true })} />
      <CommunitySettings.Screen name='CreateCommunityUrl' component={CreateCommunityUrl}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 2/3' })} />
      <CommunitySettings.Screen name='CreateCommunityReview' component={CreateCommunityReview}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 3/3' })} />
    </CommunitySettings.Navigator>
  )
}

const CommunitySettings = createStackNavigator()
export function CommunitySettingsNavigator () {
  const navigatorProps = {
    screenOptions: buildModalScreenOptions({
      headerLeftCloseIcon: false,
      headerBackTitleVisible: false
    })
  }
  return (
    <CommunitySettings.Navigator {...navigatorProps}>
      <CommunitySettings.Screen name='Community Settings' component={CommunitySettingsMenu} />
      <CommunitySettings.Screen name='Community Information' component={CommunitySettingsComponent} />
      <CommunitySettings.Screen name='Community Moderators' component={ModeratorSettings} />
      <CommunitySettings.Screen name='Invite Members' component={InvitePeople} />
    </CommunitySettings.Navigator>
  )
}

const App = createStackNavigator()
export default function AppNavigator () {
  const navigatorProps = {
    mode: 'modal',
    headerShown: false,
    screenOptions: buildModalScreenOptions
  }
  return (
    <App.Navigator {...navigatorProps}>
      <App.Screen name='Tabs' component={TabsNavigator}
        options={{ headerShown: false }} />
      <App.Screen name='Edit Post' component={PostEditor} />
      <App.Screen name='Edit Account Info' component={UserSettings} />
      <App.Screen name='Community Settings' component={CommunitySettingsNavigator}
        options={{ headerShown: false }} />
      <App.Screen name='Create Community' component={CreateCommunityNavigator}
        options={{ headerShown: false }} />
      <App.Screen name='Messages' component={MessagesNavigator}
        options={{ headerShown: false }} />
      <App.Screen name='Notifications' component={NotificationsList} />
      <App.Screen name='Notification Settings' component={NotificationSettings} />
      <App.Screen name='Blocked Users' component={BlockedUsers} />
      <App.Screen name='InviteExpired' component={InviteExpired}
        options={{ headerShown: false }} />
      <App.Screen name='JoinCommunity' component={JoinCommunity}
        options={{ headerShown: false}} />
      <App.Screen name='Search' component={SearchPage} />
      <App.Screen name='ItemChooserScreen' component={ItemChooserScreen} />
      <App.Screen name='Loading' component={LoadingScreen} />
    </App.Navigator>
  )
}
