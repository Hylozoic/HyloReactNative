import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { isFunction } from 'lodash/fp'
import header, { buildScreenOptions, buildScreenOptionsForWorkflow  } from 'navigation/header'
import buildScreenOptionsForTabsHeader from 'navigation/Tabs/Header/buildScreenOptionsForTabsHeader'
// Navigation
import TabsNavigator from 'navigation/TabsNavigator'
// Screens
import BlockedUsers from 'screens/BlockedUsers'
import CommunitySettingsMenu from 'screens/CommunitySettingsMenu'
import CommunitySettings from 'screens/CommunitySettings'
import CreateCommunityName from 'screens/CreateCommunityFlow/CreateCommunityName'
import CreateCommunityReview from 'screens/CreateCommunityFlow/CreateCommunityReview'
import CreateCommunityUrl from 'screens/CreateCommunityFlow/CreateCommunityUrl'
import Feed from 'screens/Feed'
import InviteExpired from 'screens/InviteExpired'
import InvitePeople from 'screens/InvitePeople'
import ItemChooserScreen from 'screens/ItemChooserScreen'
import JoinCommunity from 'screens/JoinCommunity'
import LoadingScreen from 'screens/LoadingScreen'
import MemberProfile from 'screens/MemberProfile'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import ModeratorSettings from 'screens/ModeratorSettings'
import NotificationSettings from 'screens/NotificationSettings'
import NotificationsList from 'screens/NotificationsList'
import NewMessage from 'screens/NewMessage'
import PostDetails from 'screens/PostDetails'
import PostEditor from 'screens/PostEditor'
import ProjectMembers from 'screens/ProjectMembers'
import Thread from 'screens/Thread'
import ThreadList from 'screens/ThreadList'
import ThreadParticipants from 'screens/ThreadParticipants'
import SearchPage from 'screens/SearchPage'
import UserSettings from 'screens/UserSettings'
import { gunsmoke } from 'style/colors'

const App = createStackNavigator()

export default function AppNavigator () {
  const navigatorProps = {
    mode: 'modal',
    headerShown: false,
    screenOptions: () => ({
      headerBackTitleVisible: false,
      headerTitleStyle: {
        fontSize: 17,
        color: 'black',
        fontFamily: 'Circular-Bold'
      },
      headerTintColor: gunsmoke,
      cardStyle: { backgroundColor: '#FFF' }
    })
  }
  
  return (
    <App.Navigator {...navigatorProps}>
      <App.Screen name='Home' component={TabsNavigator}
        options={buildScreenOptionsForTabsHeader} />
      <App.Screen name='Feed' component={Feed} />
      <App.Screen name='Member' component={MemberProfile} />
      <App.Screen name='MemberDetails' component={MemberDetails} />
      <App.Screen name='MemberSkillEditor' component={MemberSkillEditor}
        options={{ headerTitle: 'Edit Skills' }} />
      <App.Screen name='New Message' component={NewMessage}
        options={() => buildScreenOptions({ headerLeftConfirm: true })} />
      <App.Screen name='Edit Post' component={PostEditor} />
      <App.Screen name='Post Details' component={PostDetails} options={{ headerTitle: 'Detail' }} />
      <App.Screen name='Project Members' component={ProjectMembers} />
      <App.Screen name='Edit Account Info' component={UserSettings} />
      <App.Screen name='Community Settings' component={CommunitySettingsMenu} />
      <App.Screen name='Community Information' component={CommunitySettings} />
      <App.Screen name='Community Moderators' component={ModeratorSettings} />
      <App.Screen name='Invite Members' component={InvitePeople}
        options={{ headerTitle: 'Invite Members'}} />
      <App.Screen name='Notifications' component={NotificationsList}
        options={() => buildScreenOptions({ headerLeftCloseIcon: true })} />
      <App.Screen name='Messages' component={ThreadList}
        options={({ navigation }) => buildScreenOptions({
          headerLeftCloseIcon: true,
          headerRightButtonLabel: 'New',
          headerRightButtonOnPress: () => navigation.navigate('New Message')
        })} />
      {/* 
        TODO: Thread headerTitle should be link to ThreadParticipants
      */}
      <App.Screen name='ThreadParticipants' component={ThreadParticipants}
        options={{ headerTitle: 'Participants' }} />
      <App.Screen name='Thread' component={Thread} />
      <App.Screen name='Notification Settings' component={NotificationSettings} />
      <App.Screen name='Blocked Users' component={BlockedUsers} />
      <App.Screen name='InviteExpired' component={InviteExpired}
        options={{ headerShown: false }} />
      <App.Screen name='JoinCommunity' component={JoinCommunity}
        options={{ headerShown: false}} />
      <App.Screen name='CreateCommunityName' component={CreateCommunityName}
        options={buildScreenOptionsForWorkflow({ headerTitle: 'STEP 1/3' })} />
      <App.Screen name='CreateCommunityUrl' component={CreateCommunityUrl}
        options={buildScreenOptionsForWorkflow({ headerTitle: 'STEP 2/3' })} />
      <App.Screen name='CreateCommunityReview' component={CreateCommunityReview}
        options={buildScreenOptionsForWorkflow({ headerTitle: 'STEP 3/3' })} />
      <App.Screen name='Search' component={SearchPage} />
      {/* 
        TODO: Convert this final header() to buildScreenOptions() and all done!
        Maybe move this into ItemChooserScreen as an update header
      */}
      <App.Screen name='ItemChooserScreen' component={ItemChooserScreen}
        options={({ navigation, route }) => {
          const done = route.params.done || (() => {})
          const updateItems = route.params.updateItems
          const cancel = route.params.cancel || (() => {})
          const screenTitle = route.params.screenTitle
          const headerParams = {
            title: screenTitle,
            headerBackButton: cancel,
            disableOnClick: false
          }
          if (isFunction(updateItems)) {
            headerParams.right = {
              text: 'Done',
              onPress: done
            }
          }
          return header(navigation, route, headerParams)
        }} />
      <App.Screen name='Loading' component={LoadingScreen} />
    </App.Navigator>
  )
}
