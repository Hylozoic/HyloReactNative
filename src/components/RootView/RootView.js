import React, { useEffect } from 'react'
import { View } from 'react-native'
// import DeepLinkHandler from '../DeepLinkHandler'
import LoadingModal from '../LoadingModal'
import RootNavigator from 'navigation'
import VersionCheck from '../VersionCheck'

export default function RootView ({
  loading,
  signedIn,
  setupSessionWithRetry,
  openedPushNotification
}) {
  useEffect(() => { setupSessionWithRetry() }, [])

  if (loading) return <LoadingModal />
  
  // TODO: Deeplink handling using openedPushNotification

  return <View style={{flex: 1}}>
    <VersionCheck />
    <RootNavigator isSignedIn={signedIn} />  
  </View>
}
