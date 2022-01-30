import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// Helper Components
import { ModalHeader } from 'navigation/headers'
// Screens
import SearchPage from 'screens/SearchPage'

const Search = createStackNavigator()
export default function SearchNavigator () {
  const navigatorProps = {}
  return (
    <Search.Navigator {...navigatorProps}>
      <Search.Screen
        name='Search'
        component={SearchPage}
        options={{
          header: headerProps => (
            <ModalHeader
              {...headerProps}
              headerLeftOnPress={() => headerProps.navigation.navigate('Home Tab')}
            />
          )
        }}
      />
    </Search.Navigator>
  )
}
