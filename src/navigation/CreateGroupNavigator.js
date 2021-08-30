import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { buildWorkflowModalScreenOptions } from 'navigation/header'
// Screens
import CreateGroupName from 'screens/CreateGroupFlow/CreateGroupName'
import CreateGroupUrl from 'screens/CreateGroupFlow/CreateGroupUrl'
import CreateGroupVisibilityAccessibility
  from 'screens/CreateGroupFlow/CreateGroupVisibilityAccessibility'
import CreateGroupParentGroups from 'screens/CreateGroupFlow/CreateGroupParentGroups'
import CreateGroupReview from 'screens/CreateGroupFlow/CreateGroupReview'

const CreateGroup = createStackNavigator()
export default function CreateGroupNavigator () {
  const navigatorProps = {}
  return (
    <CreateGroup.Navigator {...navigatorProps}>
      <CreateGroup.Screen
        name='CreateGroupName' component={CreateGroupName}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 1/6', headerLeftCloseIcon: true })}
      />
      <CreateGroup.Screen
        name='CreateGroupUrl' component={CreateGroupUrl}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 2/6' })}
      />
      <CreateGroup.Screen
        name='CreateGroupVisibilityAccessibility' component={CreateGroupVisibilityAccessibility}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 4/6' })}
      />
      <CreateGroup.Screen
        name='CreateGroupParentGroups' component={CreateGroupParentGroups}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 5/6' })}
      />
      <CreateGroup.Screen
        name='CreateGroupReview' component={CreateGroupReview}
        options={buildWorkflowModalScreenOptions({ headerTitle: 'STEP 6/6' })}
      />
    </CreateGroup.Navigator>
  )
}
