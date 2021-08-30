import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { WorkflowModalHeader } from './header/ModalHeader'
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
        options={{
          header: headerProps => <WorkflowModalHeader {...headerProps}
            headerTitle='STEP 1/5'
            headerLeftCloseIcon={true}
          />
        }}
      />
      <CreateGroup.Screen
        name='CreateGroupUrl' component={CreateGroupUrl}
        options={{
          header: headerProps => <WorkflowModalHeader {...headerProps}
            headerTitle='STEP 2/5'
          />
        }}
      />
      <CreateGroup.Screen
        name='CreateGroupVisibilityAccessibility' component={CreateGroupVisibilityAccessibility}
        options={{
          header: headerProps => <WorkflowModalHeader {...headerProps}
            headerTitle='STEP 3/5'
          />
        }}
      />
      <CreateGroup.Screen
        name='CreateGroupParentGroups' component={CreateGroupParentGroups}
        options={{
          header: headerProps => <WorkflowModalHeader {...headerProps}
            headerTitle='STEP 4/5'
          />
        }}
      />
      <CreateGroup.Screen
        name='CreateGroupReview' component={CreateGroupReview}
        options={{
          header: headerProps => <WorkflowModalHeader {...headerProps}
            headerTitle='STEP 5/5'
          />
        }}
      />
    </CreateGroup.Navigator>
  )
}
