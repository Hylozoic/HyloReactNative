import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// Helper Components
import { ModalHeader } from 'navigation/headers'
// Screens
import NewMessage from 'screens/NewMessage'
import Thread from 'screens/Thread'
import ThreadList from 'screens/ThreadList'
import ThreadParticipants from 'screens/ThreadParticipants'

const Messages = createStackNavigator()
export default function MessagesNavigator () {
  const navigatorProps = {
    screenOptions: {
      headerMode: 'float'
    }
  }
  return (
    <Messages.Navigator {...navigatorProps}>
      <Messages.Screen
        name='Messages'
        component={ThreadList}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerRightButtonLabel='New'
            headerRightButtonOnPress={() => headerProps.navigation.navigate('New Message')}
          />
        }}
      />
      <Messages.Screen
        name='New Message'
        component={NewMessage}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
          />
        }}
      />
      <Messages.Screen
        name='ThreadParticipants'
        component={ThreadParticipants}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
            title='Participants'
          />
        }}
      />
      <Messages.Screen
        name='Thread'
        component={Thread}
        options={{
          header: headerProps => <ModalHeader {...headerProps}
            headerLeftCloseIcon={false}
            headerLeftOnPress={() => headerProps.navigation.navigate('Messages')}
          />
        }}
      />
    </Messages.Navigator>
  )
}
