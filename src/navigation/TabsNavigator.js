import React from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { isIOS } from 'util/platform'
import getMe from 'store/selectors/getMe'
// Helper Components
import Icon from 'components/Icon'
import Avatar from 'components/Avatar'
import { ModalHeader, TabStackHeader } from 'navigation/headers'
// Screens
import Feed from 'screens/Feed'
import GroupDetail from 'screens/GroupDetail'
import GroupNavigation from 'screens/GroupNavigation'
import Groups from 'screens/Groups'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberProfile from 'screens/MemberProfile'
import MembersComponent from 'screens/Members'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import NewMessage from 'screens/NewMessage'
import PostDetails from 'screens/PostDetails'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'
import SearchPage from 'screens/SearchPage'
import Thread from 'screens/Thread'
import ThreadList from 'screens/ThreadList'
import ThreadParticipants from 'screens/ThreadParticipants'
import TopicsComponent from 'screens/Topics'
import { caribbeanGreen, gainsboro, gunsmoke, rhino05, white } from 'style/colors'

const MessagesTab = createStackNavigator()
export function MessagesTabNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float'
    }
  }
  return (
    <MessagesTab.Navigator {...navigatorProps}>
      <MessagesTab.Screen
        name='Messages'
        component={ThreadList}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerRightButtonLabel='New'
            headerRightButtonOnPress={() => headerProps.navigation.navigate('New Message')}
          />
        }}
      />
      <MessagesTab.Screen
        name='New Message'
        component={NewMessage}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
          />
        }}
      />
      <MessagesTab.Screen
        name='ThreadParticipants'
        component={ThreadParticipants}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
            title='Participants'
          />
        }}
      />
      <MessagesTab.Screen
        name='Thread'
        component={Thread}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
            headerLeftOnPress={() => headerProps.navigation.navigate('Messages')}
          />
        }}
      />
    </MessagesTab.Navigator>
  )
}

const SearchTab = createStackNavigator()
export function SearchTabNavigator () {
  const navigatorProps = {}
  return (
    <SearchTab.Navigator {...navigatorProps}>
      <SearchTab.Screen name='Search'
        component={SearchPage}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftOnPress={() => headerProps.navigation.navigate('Home Tab')}
          />
        }}
      />
    </SearchTab.Navigator>
  )
}

const HomeTab = createStackNavigator()
export function HomeTabNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float',
      header: headerProps => <TabStackHeader {...headerProps} />
    }
  }

  return (
    <HomeTab.Navigator {...navigatorProps}>
      <HomeTab.Screen name='Group Navigation' component={GroupNavigation} />
      <HomeTab.Screen name='Feed' component={Feed} />
      <HomeTab.Screen name='Topic Feed' key='Topic Feed' component={Feed} />
      <HomeTab.Screen name='Post Details' key='Post Details' component={PostDetails} />
      <HomeTab.Screen name='Projects' component={Feed} initialParams={{ feedType: 'project' }} />
      <HomeTab.Screen name='Project Members' key='Project Members' component={ProjectMembers} />
      <HomeTab.Screen name='Events' component={Feed} initialParams={{ feedType: 'event' }} />
      <HomeTab.Screen name='Members' component={MembersComponent} />
      <HomeTab.Screen name='Member' key='Member' component={MemberProfile} />
      <HomeTab.Screen name='Member Details' component={MemberDetails} />
      <HomeTab.Screen name='Group Relationships' component={Groups} />
      <HomeTab.Screen name='Group Detail' component={GroupDetail} />
      <HomeTab.Screen name='Topics' component={TopicsComponent} />
    </HomeTab.Navigator>
  )
}

const MyProfile = createStackNavigator()
export function MyProfileNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float',
      header: headerProps => <ModalHeader {...headerProps}
        headerLeftCloseIcon={false}
      />
    }
  }
  return <MyProfile.Navigator {...navigatorProps}>
    <MyProfile.Screen name='My Profile' component={MemberDetails} />
    <MyProfile.Screen name='Edit Your Skills' component={MemberSkillEditor} />
  </MyProfile.Navigator>
}

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
  const navigatorProps = {
    screenOptions: ({ route }) => ({
      //
      // NOTE: This is required so the home tab is available 
      //       when path linking into the app to a child tab.
      // 
      //       Lazy loading so make sure to check for focus
      //       before fetching for the initial screen on 
      //       any Tab stack.
      lazy: false,
      // TODO: Required for Android, not iOS
      // Set only for Android as it makes undesirable animation in iOS
      tabBarHideOnKeyboard: !isIOS,
      tabBarShowLabel: true,
      tabBarPressColor: gainsboro,
      tabBarIndicatorStyle: { backgroundColor: white },
      tabBarStyle: isIOS ?
        {
          display: 'flex',
          backgroundColor: rhino05
        } : {
          display: 'flex',
          backgroundColor: rhino05,
          borderTopWidth: StyleSheet.hairlineWidth
        },
      tabBarShowLabel: true,
      tabBarIcon: ({ focused }) => (
        <Icon
          name={route.name.split(' Tab')[0]}
          size={30}
          color={focused ? caribbeanGreen : gunsmoke}
          style={{ paddingTop: isIOS ? 0 : 5 }}
        />
      ),
      tabBarLabel: () => null,
      headerShown: false
    })
  }
  const currentUser = useSelector(getMe)

  return (
    <Tabs.Navigator {...navigatorProps}>
      <Tabs.Screen name='Home Tab' component={HomeTabNavigator} />
      <Tabs.Screen name='Search Tab' component={SearchTabNavigator} />
      <Tabs.Screen name='Messages Tab' component={MessagesTabNavigator} />
      <Tabs.Screen
        name='Profile Tab'
        component={MyProfileNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Avatar style={{
              borderWidth: 2,
              borderColor: focused ? caribbeanGreen : rhino05 }}
              dimension={34}
              hasBorder
              avatarUrl={currentUser?.avatarUrl}
            />
          )
        }}
      />
    </Tabs.Navigator>
  )
}
