import React, { useMemo } from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Loading from '../Loading'
import VersionCheck from '../VersionCheck'
import RootNavigator from 'navigation'
import linking from 'navigation/linking'

export default function RootView ({
  loading,
  signedIn,
  loadCurrentUserSession,
  openedPushNotification
}) {
  useMemo(() => { loadCurrentUserSession() }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading style={styles.loading} />
      </View>
    )
  }

  // TODO: Deeplink handling using openedPushNotification
  return (
    <View style={styles.rootContainer}>
      <SafeAreaProvider>
        <VersionCheck />
        <NavigationContainer linking={linking}>
          <RootNavigator isSignedIn={signedIn} />
        </NavigationContainer>
      </SafeAreaProvider>
    </View>
  )
}

const styles = {
  rootContainer: {
    flex: 1
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginBottom: 15
  }
}
