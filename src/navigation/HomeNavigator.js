import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack'
import { isEmpty } from 'lodash/fp'
import useCurrentGroup from 'hooks/useCurrentGroup'
import useOpenInitialURL from 'hooks/useOpenInitialURL'
import useReturnToOnAuthPath from 'hooks/useReturnToOnAuthPath'
import getReturnToOnAuthPath from 'store/selectors/getReturnToOnAuthPath'
// Helper Components
import TabStackHeader from 'navigation/headers/TabStackHeader'
// Screens
import AllTopicsWebView from 'screens/AllTopicsWebView'
import ChatRoom from 'screens/ChatRoomWebView'
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

const HomeTab = createStackNavigator()
export default function HomeNavigator ({ navigation }) {
  const initialURL = useSelector(state => state.initialURL)
  const returnToOnAuthPath = useSelector(getReturnToOnAuthPath)
  const [, setCurrentGroup] = useCurrentGroup()

  useEffect(() => {
    if (!initialURL && !returnToOnAuthPath) {
      setTimeout(() => navigation.navigate('Feed'), 400)
    }
  }, [])

  useOpenInitialURL()
  useReturnToOnAuthPath()

  const navigatorProps = {
    initialRouteName: 'Group Navigation',
    screenListeners: {
      state: (e) => {
        const routes = e.data.state.routes
        const groupSlugs = routes
          .map(route => route.params?.groupSlug)
          .filter(s => !isEmpty(s))

        setCurrentGroup(!isEmpty(groupSlugs) && groupSlugs[groupSlugs.length - 1])
      }
    },
    screenOptions: {
      animationEnabled: !initialURL,
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
      <HomeTab.Screen name='Chat' component={ChatRoom} />
    </HomeTab.Navigator>
  )
}
