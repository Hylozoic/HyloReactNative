import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { isIOS } from 'util/platform'
// Helper Components
import Icon from 'components/Icon'
import { buildTabStackScreenOptions }  from 'navigation/header'
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
import { caribbeanGreen } from 'style/colors'

const Home = createStackNavigator()
export function HomeNavigator () {
  const navigatorProps = {
    screenOptions: buildTabStackScreenOptions
  }
  return (
    <Home.Navigator {...navigatorProps}>
      <Home.Screen name='Home' component={Feed} />
      {/* In common  */}
      <Home.Screen name='Topic Feed' component={Feed} />
      <Home.Screen name='Post Details' component={PostDetails} />
      <Home.Screen name='Project Members' component={ProjectMembers} />
      <Home.Screen name='Member' component={MemberProfile} />
      <Home.Screen name='MemberDetails' component={MemberDetails} />
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
      <Members.Screen name='MemberSkillEditor' component={MemberSkillEditor}
        options={{ headerTitle: 'Edit Skills' }} />
      {/* In common  */}
      <Home.Screen name='Topic Feed' component={Feed} />
      <Home.Screen name='Post Details' component={PostDetails} />
      <Home.Screen name='Project Members' component={ProjectMembers} />
      <Home.Screen name='Member' component={MemberProfile} />
      <Home.Screen name='MemberDetails' component={MemberDetails} />
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
      {/* In common  */}
      <Home.Screen name='Topic Feed' component={Feed} />
      <Home.Screen name='Post Details' component={PostDetails} />
      <Home.Screen name='Project Members' component={ProjectMembers} />
      <Home.Screen name='Member' component={MemberProfile} />
      <Home.Screen name='MemberDetails' component={MemberDetails} />
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
      {/* In common  */}
      <Home.Screen name='Topic Feed' component={Feed} />
      <Home.Screen name='Post Details' component={PostDetails} />
      <Home.Screen name='Project Members' component={ProjectMembers} />
      <Home.Screen name='Member' component={MemberProfile} />
      <Home.Screen name='MemberDetails' component={MemberDetails} />
    </Projects.Navigator>
  )
}

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
  const navigatorProps = {
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      // TODO: Required for Android, not iOS.
      // Set only for Android if makes undesirable animation in iOS.
      keyboardHidesTabBar: true,
      pressColor: '#DCDCDC',
      indicatorStyle: { backgroundColor: 'white' },
      style: isIOS 
        ? { backgroundColor: 'white' }
        : { backgroundColor: 'white', borderTopWidth: StyleSheet.hairlineWidth }
    },
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused }) => (
        <Icon
          name={route.name}
          size={28}
          color={focused ? caribbeanGreen : '#929292'}
          style={{ paddingTop: isIOS ? 0 : 5 }}
        />
      ),      
      tabBarLabel: ({ focused }) => (
        <View style={{ textAlign: 'center', fontSize: 11, color: '#929292' }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 11,
            color: focused ? caribbeanGreen : '#929292'
          }}>
            {route.name}
          </Text>
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
