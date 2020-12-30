import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
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
import ProjectsComponent from 'screens/Projects'
import TopicsComponent from 'screens/Topics'
import PostDetails from 'screens/PostDetails'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'
import { caribbeanGreen, gainsboro, gunsmoke, rhino05, rhino10, rhino20, white } from 'style/colors'

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
      <Home.Screen name='Home' component={Feed} />
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
      {getScreensInCommon(Home)}
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
      {getScreensInCommon(Home)}
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
      <Projects.Screen name='Projects' component={ProjectsComponent} />
      {getScreensInCommon(Home)}
    </Projects.Navigator>
  )
}

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
  const navigatorProps = {
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
      tabBarLabel: ({ focused }) => (
        <View style={{ textAlign: 'center', fontSize: 11, color: gunsmoke }}>
          {/* <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: focused ? caribbeanGreen : gunsmoke
          }}
          >
            {route.name}
          </Text> */}
        </View>
      )
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
