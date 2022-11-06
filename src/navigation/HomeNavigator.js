import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// Helper Components
import { TabStackHeader } from 'navigation/headers'
// Screens
import Feed from 'screens/Feed'
import GroupExploreWebView from 'screens/GroupExploreWebView'
import GroupNavigation from 'screens/GroupNavigation'
import Groups from 'screens/Groups'
import MemberDetails from 'screens/MemberProfile/MemberDetails'
import MemberProfile from 'screens/MemberProfile'
import MembersComponent from 'screens/Members'
import PostDetails from 'screens/PostDetails'
import ProjectMembers from 'screens/ProjectMembers/ProjectMembers'
import MapWebView from 'screens/MapWebView/MapWebView'
import AllTopicsWebView from 'screens/AllTopicsWebView/AllTopicsWebView'

const HomeTab = createStackNavigator()
export default function HomeNavigator () {
  const navigatorProps = {
    initialRouteName: 'Group Navigation',
    screenOptions: {
      transitionSpec: {
        open: {
          animation: 'spring',
          stiffness: 1000,
          damping: 500,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01
        },
        close: {
          animation: 'spring',
          stiffness: 1000,
          damping: 500,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01
        }
      },
      headerMode: 'float',
      header: headerProps => <TabStackHeader {...headerProps} />
    }
  }

  return (
    <HomeTab.Navigator {...navigatorProps}>
      <HomeTab.Screen name='Group Navigation' component={GroupNavigation} />
      <HomeTab.Screen name='Feed' options={{ title: 'Stream' }} component={Feed} />
      <HomeTab.Screen name='Post Details' key='Post Details' component={PostDetails} />
      <HomeTab.Screen name='Projects' component={Feed} initialParams={{ feedType: 'project' }} />
      <HomeTab.Screen name='Project Members' key='Project Members' component={ProjectMembers} />
      <HomeTab.Screen name='Events' component={Feed} initialParams={{ feedType: 'event' }} />
      <HomeTab.Screen name='Members' component={MembersComponent} />
      <HomeTab.Screen name='Member' key='Member' component={MemberProfile} />
      <HomeTab.Screen name='Member Details' component={MemberDetails} />
      <HomeTab.Screen name='Group Relationships' component={Groups} />
      <HomeTab.Screen name='Group Explore' component={GroupExploreWebView} />
      <HomeTab.Screen name='Topics' component={AllTopicsWebView} />
      <HomeTab.Screen name='Map' component={MapWebView} />
    </HomeTab.Navigator>
  )
}
