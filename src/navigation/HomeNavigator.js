import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// Helper Components
import { TabStackHeader } from 'navigation/headers'
// Screens
import Feed from 'screens/Feed'
import GroupDetail from 'screens/GroupDetail'
import GroupNavigation from 'screens/GroupNavigation'
import Groups from 'screens/Groups'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberProfile from 'screens/MemberProfile'
import MembersComponent from 'screens/Members'
import PostDetails from 'screens/PostDetails'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'
import TopicsComponent from 'screens/Topics'

const HomeTab = createStackNavigator()
export default function HomeNavigator () {
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