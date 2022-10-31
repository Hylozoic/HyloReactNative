import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ModalHeader } from './headers'
import SearchPage from 'screens/SearchPage'
import { ghost, rhino80 } from 'style/colors'

const Search = createStackNavigator()
export default function SearchNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerStyle: { backgroundColor: ghost },
      headerTitleStyle: { color: rhino80 },
      header: headerProps => (
        <ModalHeader
          {...headerProps}
          // Hides "X button
          headerLeft={() => {}}
        />
      )

    }
  }

  return (
    <Search.Navigator {...navigatorProps}>
      <Search.Screen
        name='Search'
        component={SearchPage}
      />
    </Search.Navigator>
  )
}
