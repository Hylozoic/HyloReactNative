import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { isIOS } from 'util/platform'
// Helper Components
import Icon from 'components/Icon'
import { buildTabStackScreenOptions } from 'navigation/header'
// Screens
import Feed from 'screens/Feed'
import MembersComponent from 'screens/Members'
import MemberProfile from 'screens/MemberProfile'
import TopicsComponent from 'screens/Topics'
import PostDetails from 'screens/PostDetails'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'
import { caribbeanGreen, gainsboro, gunsmoke, rhino05, white } from 'style/colors'

export function getScreensInCommon (Stack) {
  return [
    <Stack.Screen name='Topic Feed' key='Topic Feed' component={Feed} />,
    <Stack.Screen name='Post Details' key='Post Details' component={PostDetails} />,
    <Stack.Screen name='Project Members' key='Project Members' component={ProjectMembers} />,
    <Stack.Screen name='Member' key='Member' component={MemberProfile} />,
    <Stack.Screen name='MemberDetails' key='MemberDetails' component={MemberDetails} />
  ]
}

const Home = createStackNavigator()
export function HomeNavigator () {
  const navigatorProps = {
    screenOptions: buildTabStackScreenOptions
  }
  return (
    <Home.Navigator {...navigatorProps}>
      <Home.Screen name='Feed' component={Feed} />
      {getScreensInCommon(Home)}
    </Home.Navigator>
  )
}

const Members = createStackNavigator()
export function MembersNavigator () {
  const navigatorProps = {
    screenOptions: buildTabStackScreenOptions
  }
  return (
    <Members.Navigator {...navigatorProps}>
      <Members.Screen name='Members' component={MembersComponent} />
      <Members.Screen
        name='MemberSkillEditor'
        component={MemberSkillEditor}
        options={{ headerTitle: 'Edit Skills' }}
      />
      {getScreensInCommon(Members)}
    </Members.Navigator>
  )
}

const Topics = createStackNavigator()
export function TopicsNavigator () {
  const navigatorProps = {
    screenOptions: buildTabStackScreenOptions
  }
  return (
    <Topics.Navigator {...navigatorProps}>
      <Topics.Screen name='Topics' component={TopicsComponent} />
      {getScreensInCommon(Topics)}
    </Topics.Navigator>
  )
}

const Projects = createStackNavigator()
export function ProjectsNavigator () {
  const navigatorProps = {
    screenOptions: buildTabStackScreenOptions
  }
  return (
    <Projects.Navigator {...navigatorProps}>
      <Projects.Screen name='Projects' component={Feed} initialParams={{ isProjectFeed: true }} />
      {getScreensInCommon(Projects)}
    </Projects.Navigator>
  )
}

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
  const navigatorProps = {
    //
    // NOTE: This is required so the home tab is available 
    //       when path linking into the app to a child tab.
    // 
    //       Lazy loading so make sure to check for focus
    //       before fetching for the initial screen on 
    //       any Tab stack.
    //
    lazy: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      // TODO: Required for Android, not iOS
      // Set only for Android as it makes undesirable animation in iOS
      keyboardHidesTabBar: !isIOS,
      pressColor: gainsboro,
      indicatorStyle: { backgroundColor: white },
      style: isIOS
        ? { backgroundColor: rhino05 }
        : { backgroundColor: rhino05, borderTopWidth: StyleSheet.hairlineWidth }
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused }) => (
        <Icon
          name={route.name}
          size={24}
          color={focused ? caribbeanGreen : gunsmoke}
          style={{ paddingTop: isIOS ? 0 : 5 }}
        />
      ),
      tabBarLabel: () => null
    })
  }
  return (
    <Tabs.Navigator {...navigatorProps}>
      <Tabs.Screen name='Home' component={HomeNavigator} />
      <Tabs.Screen name='Members' component={MembersNavigator} />
      <Tabs.Screen name='Topics' component={TopicsNavigator} />
      <Tabs.Screen name='Projects' component={ProjectsNavigator} />
    </Tabs.Navigator>
  )
}
