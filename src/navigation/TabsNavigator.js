import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { isIOS } from 'util/platform'
// Helpers
import TabIcon from 'navigation/Tabs/TabIcon'
import TabLabel from 'navigation/Tabs/TabLabel'
import tabStyles from 'navigation/Tabs/Tabs.styles'
// Screens
import Feed from 'screens/Feed'
import MembersComponent from 'screens/Members'
import MemberProfile from 'screens/MemberProfile'
import ProjectsComponent from 'screens/Projects'
import TopicsComponent from 'screens/Topics'
import buildScreenOptionsForTabsHeader from 'navigation/Tabs/Header/buildScreenOptionsForTabsHeader'
import PostDetails from 'screens/PostDetails'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'

const Home = createStackNavigator()
export function HomeNavigator () {
  const navigatorProps = {
    screenOptions: buildScreenOptionsForTabsHeader
  }
  return (
    <Home.Navigator {...navigatorProps}>
      <Home.Screen name='Feed' component={Feed} />
      <Home.Screen name='Topic Feed' component={Feed} />
      <Home.Screen name='Post Details' component={PostDetails} />
      <Home.Screen name='Project Members' component={ProjectMembers} />
    </Home.Navigator>
  )
}

const Members = createStackNavigator()
export function MembersNavigator () {
  const navigatorProps = {
    screenOptions: buildScreenOptionsForTabsHeader
  }
  return (
    <Members.Navigator {...navigatorProps}>
      <Members.Screen name='Members' component={MembersComponent} />
      <Members.Screen name='Member' component={MemberProfile} />
      <Members.Screen name='MemberDetails' component={MemberDetails} />
      <Members.Screen name='MemberSkillEditor' component={MemberSkillEditor}
        options={{ headerTitle: 'Edit Skills' }} />
      <Members.Screen name='Post Details' component={PostDetails} />
    </Members.Navigator>
  )
}

const Topics = createStackNavigator()
export function TopicsNavigator () {
  const navigatorProps = {
    screenOptions: buildScreenOptionsForTabsHeader
  }
  return (
    <Topics.Navigator {...navigatorProps}>
      <Topics.Screen name='Topics' component={TopicsComponent} />
      <Topics.Screen name='Topic Feed' component={Feed} />
      <Topics.Screen name='Post Details' component={PostDetails} />
    </Topics.Navigator>
  )
}

const Projects = createStackNavigator()
export function ProjectsNavigator () {
  const navigatorProps = {
    screenOptions: buildScreenOptionsForTabsHeader
  }
  return (
    <Projects.Navigator {...navigatorProps}>
      <Projects.Screen name='Projects' component={ProjectsComponent} />
      <Projects.Screen name='Post Details' component={PostDetails} />
      <Projects.Screen name='Project Members' component={ProjectMembers} />
      <Projects.Screen name='MemberDetails' component={MemberDetails} />
    </Projects.Navigator>
  )
}

const Tabs = createBottomTabNavigator()
export default function TabsNavigator () {
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
      <Tabs.Screen name='Home' component={HomeNavigator} />
      <Tabs.Screen name='Members' component={MembersNavigator} />
      <Tabs.Screen name='Topics' component={TopicsNavigator} />
      <Tabs.Screen name='Projects' component={ProjectsNavigator} />
    </Tabs.Navigator>
  )
}
