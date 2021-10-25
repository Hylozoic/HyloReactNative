import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// Helper Components
import { ModalHeader } from 'navigation/headers'
// Screens
import MemberSkillEditor from 'screens/MemberProfile/MemberSkillEditor'
import UserSettingsNavigator from './UserSettingsNavigator'

const MyProfile = createStackNavigator()
export default function MyProfileNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float',
      header: headerProps => <ModalHeader {...headerProps}
        headerLeftCloseIcon={false}
      />
    }
  }
  return <MyProfile.Navigator {...navigatorProps}>
    <MyProfile.Screen name='My Profile' component={UserSettingsNavigator} />
    <MyProfile.Screen name='Edit Your Skills' component={MemberSkillEditor} />
  </MyProfile.Navigator>
}
