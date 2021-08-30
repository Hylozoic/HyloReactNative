import React, { useEffect } from 'react'
import { View, Linking, InteractionManager } from 'react-native'
import { useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import RNBootSplash from "react-native-bootsplash"
import Loading from 'components/Loading'
import RootNavigator from 'navigation/RootNavigator'
import customLinking, { navigateToLinkingPath } from 'navigation/linking/custom'
import { navigationRef, isReadyRef } from 'navigation/utils'
import setReturnToPath from 'store/actions/setReturnToPath'

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  currentUser,
  checkSessionAndSetSignedIn,
  loadCurrentUserSession,
  returnToPath,
  openedPushNotification
}) {
  const dispatch = useDispatch()
  
  useEffect(() => { checkSessionAndSetSignedIn() }, [])
  useEffect(() => { signedIn && loadCurrentUserSession() }, [signedIn])
  // useEffect(() => { 
  //   if (
  //     !loading &&
  //     !signupInProgress &&
  //     signedIn &&
  //     returnToPath &&
  //     isReadyRef.current &&
  //     navigationRef.current
  //   ) {
  //     // TODO: A temporary hack because there really doesn't seem
  //     // a reliable way to tell when we're ready to navigate.
  //     //
  //     // * Try with callBackRef pattern...
  //     // * Why doesn't this work?: Linking.openURL(`hyloapp://${returnToPath}`)
  //     setTimeout(
  //       () => {
  //         navigateToLinkingPath(returnToPath)
  //         dispatch(setReturnToPath(null))
  //       },
  //       1000
  //     )
  //   }
  // }, [
  //   loading,
  //   signupInProgress,
  //   signedIn,
  //   returnToPath
  // ])
  useEffect(() => {
    console.log('!!!! openedPushNotification:', openedPushNotification)
  }, [openedPushNotification])

  if (loading && !signupInProgress) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size='large' style={styles.loading} />
      </View>
    )
  }

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        onReady={() => { 
          isReadyRef.current = true
          RNBootSplash.hide()
        }}
      >
        <RootNavigator
          signedIn={signedIn}
          signupInProgress={signupInProgress}
          currentUser={currentUser}
        />
      </NavigationContainer>
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

// TODO: DELETE ME -- just notes at this point
// import { View, Linking } from 'react-native'
// import { useDispatch, useSelector } from 'react-redux'
// import { STORE_RETURN_TO_PATH } from 'store/constants'
// const dispatch = useDispatch()
// const returnToPath = useSelector(state => state.session.returnToPath)
// if (signedIn && !signupInProgress && returnToPath) {
//   console.log('!!!! returnToPath:', returnToPath)
//   dispatch({
//     type: STORE_RETURN_TO_PATH,
//     payload: null
//   })

//   Linking.openURL('hyloapp://' + 'm')

//   return null
// }
// //    forward to the link saved?import { NavigationContainer } from '@react-navigation/native'