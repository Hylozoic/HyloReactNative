import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import SearchPage from 'screens/SearchPage'
import { white } from 'style/colors'

const Search = createStackNavigator()
export default function SearchNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float',
      headerStyle: { backgroundColor: white }
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
