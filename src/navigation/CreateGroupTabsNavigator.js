import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { WorkflowModalHeader } from 'navigation/headers'
// Screens
import CreateGroupName from 'screens/CreateGroupFlow/CreateGroupName'
import CreateGroupUrl from 'screens/CreateGroupFlow/CreateGroupUrl'
import CreateGroupVisibilityAccessibility
  from 'screens/CreateGroupFlow/CreateGroupVisibilityAccessibility'
import CreateGroupParentGroups from 'screens/CreateGroupFlow/CreateGroupParentGroups'
import CreateGroupReview from 'screens/CreateGroupFlow/CreateGroupReview'
import { white20onCaribbeanGreen } from 'style/colors'
import CreateGroupTabBar from './CreateGroupTabBar'

const CreateGroupTabs = createBottomTabNavigator()
export default function CreateGroupTabsNavigator () {
  const navigatorProps = {
    tabBar: props => <CreateGroupTabBar {...props} />,
    screenOptions: {
      header: headerProps => <WorkflowModalHeader {...headerProps} style={{backgroundColor: white20onCaribbeanGreen }} />
    },
  }
  return (
    <CreateGroupTabs.Navigator {...navigatorProps}>
      <CreateGroupTabs.Screen
        name='CreateGroupName'
        component={CreateGroupName}
        options={{ title: 'STEP 1/5', headerLeftCloseIcon: true }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupUrl'
        component={CreateGroupUrl}
        options={{ title: 'STEP 2/5' }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupVisibilityAccessibility'
        component={CreateGroupVisibilityAccessibility}
        options={{ title: 'STEP 3/5' }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupParentGroups'
        component={CreateGroupParentGroups}
        options={{ title: 'STEP 4/5' }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupReview'
        component={CreateGroupReview}
        options={{ title: 'STEP 5/5' }}
      />
    </CreateGroupTabs.Navigator>
  )
}
