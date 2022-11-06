import React from 'react'
import { isEmpty } from 'lodash/fp'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'
import WorkflowModalHeader from 'navigation/headers/WorkflowModalHeader'
import CreateGroupTabBar from 'screens/CreateGroupFlow/CreateGroupTabBar'
import { GROUP_ACCESSIBILITY } from 'store/models/Group'
import getMemberships from 'store/selectors/getMemberships'
// Screens
import CreateGroupName from 'screens/CreateGroupFlow/CreateGroupName'
import CreateGroupUrl from 'screens/CreateGroupFlow/CreateGroupUrl'
import CreateGroupVisibilityAccessibility from 'screens/CreateGroupFlow/CreateGroupVisibilityAccessibility'
import CreateGroupParentGroups from 'screens/CreateGroupFlow/CreateGroupParentGroups'
import CreateGroupReview from 'screens/CreateGroupFlow/CreateGroupReview'
import { white20onCaribbeanGreen } from 'style/colors'

const CreateGroupTabs = createBottomTabNavigator()
export default function CreateGroupTabsNavigator () {
  const memberships = useSelector(getMemberships)
  const parentGroupOptions = memberships
    .filter(m => m.hasModeratorRole || m.group.accessibility === GROUP_ACCESSIBILITY.Open)
  const hasParentGroupOptions = !isEmpty(parentGroupOptions)
  const totalSteps = hasParentGroupOptions ? 5 : 4
  const navigatorProps = {
    tabBar: props => <CreateGroupTabBar {...props} />,
    // NOTE: This is how to have back button functionality
    // backBehavior: 'order',
    animationEnabled: false,
    screenOptions: {
      header: headerProps => {
        const close = () => headerProps.navigation.navigate('Drawer')
        return (
          <WorkflowModalHeader
            {...headerProps}
            headerLeftCloseIcon
            headerLeftOnPress={close}
            style={{ backgroundColor: white20onCaribbeanGreen }}
          />
        )
      }
    }
  }

  return (
    <CreateGroupTabs.Navigator {...navigatorProps}>
      <CreateGroupTabs.Screen
        name='CreateGroupName'
        component={CreateGroupName}
        options={{ title: `STEP 1/${totalSteps}`, headerLeftCloseIcon: true }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupUrl'
        component={CreateGroupUrl}
        options={{ title: `STEP 2/${totalSteps}` }}
      />
      <CreateGroupTabs.Screen
        name='CreateGroupVisibilityAccessibility'
        component={CreateGroupVisibilityAccessibility}
        options={{ title: `STEP 3/${totalSteps}` }}
      />
      {hasParentGroupOptions && (
        <CreateGroupTabs.Screen
          name='CreateGroupParentGroups'
          component={CreateGroupParentGroups}
          options={{ title: `STEP ${totalSteps - 1}/${totalSteps}` }}
        />
      )}
      <CreateGroupTabs.Screen
        name='CreateGroupReview'
        component={CreateGroupReview}
        options={{ title: `STEP ${totalSteps}/${totalSteps}` }}
      />
    </CreateGroupTabs.Navigator>
  )
}
