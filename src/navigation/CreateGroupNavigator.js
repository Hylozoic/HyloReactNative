import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { WorkflowModalHeader } from 'navigation/headers'
// Screens
import CreateGroupName from 'screens/CreateGroupFlow/CreateGroupName'
import CreateGroupUrl from 'screens/CreateGroupFlow/CreateGroupUrl'
import CreateGroupVisibilityAccessibility
  from 'screens/CreateGroupFlow/CreateGroupVisibilityAccessibility'
import CreateGroupParentGroups from 'screens/CreateGroupFlow/CreateGroupParentGroups'
import CreateGroupReview from 'screens/CreateGroupFlow/CreateGroupReview'
import { white } from 'style/colors'

const CreateGroup = createStackNavigator()
export default function CreateGroupNavigator () {
  const navigatorProps = {
    presentation: 'modal',
    screenOptions: {
      header: headerProps =>
        <WorkflowModalHeader {...headerProps} headerStatusBarHeight={0} />
    },
  }
  return (
    <CreateGroup.Navigator {...navigatorProps}>
      <CreateGroup.Screen
        name='CreateGroupName'
        component={CreateGroupName}
        options={{ title: 'STEP 1/5', headerLeftCloseIcon: true }}
      />
      <CreateGroup.Screen
        name='CreateGroupUrl'
        component={CreateGroupUrl}
        options={{ title: 'STEP 2/5' }}
      />
      <CreateGroup.Screen
        name='CreateGroupVisibilityAccessibility'
        component={CreateGroupVisibilityAccessibility}
        options={{ title: 'STEP 3/5' }}
      />
      <CreateGroup.Screen
        name='CreateGroupParentGroups'
        component={CreateGroupParentGroups}
        options={{ title: 'STEP 4/5' }}
      />
      <CreateGroup.Screen
        name='CreateGroupReview'
        component={CreateGroupReview}
        options={{ title: 'STEP 5/5' }}
      />
    </CreateGroup.Navigator>
  )
}
