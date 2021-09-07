import React, { useEffect, createRef } from 'react'
import { View, Linking, InteractionManager } from 'react-native'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { useFlipper, useReduxDevToolsExtension } from '@react-navigation/devtools'
import RNBootSplash from "react-native-bootsplash"
import Loading from 'components/Loading'
import RootNavigator from 'navigation/RootNavigator'
import customLinking, { navigateToLinkingPath } from 'navigation/linking/custom'
import setReturnToPath from 'store/actions/setReturnToPath'

// const initialState = {
//   name: 'Tabs',
//   state: {
//     routes: [
//       {
//         name: 'Home', 
//         state: {
//           routes: [
//             { name: 'Group Navigation' },
//             { name: 'Feed' }
//           ]
//         }
//       }
//     ]
//   }
// }
// const initialState = {
//   routes: [{
//     screen: 'Tabs',
//     params: {
//       screen: 'Home',
//       params: {
//         screen: 'Group Navigation',
//         // initial: false
//       }
//     }
//   }]
// }
export const isReadyRef = createRef()
export const navigationRef = createNavigationContainerRef()

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  currentUser,
  loadCurrentUserSession,
  returnToPath,
  openedPushNotification
}) {
  // if (typeof(HermesInternal) === "undefined") {
  //   console.log("Hermes is not enabled");
  // } else {
  //   console.log("Hermes is enabled");
  // }
  
  useFlipper(navigationRef)
  // useReduxDevToolsExtension(navigationRef)

  // useEffect(() => { checkSessionAndSetSignedIn() }, [])
  useEffect(() => { loadCurrentUserSession() }, [signedIn])
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
  //         navigateToLinkingPath(navigationRef, returnToPath)
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
  const fullyAuthorized = !signupInProgress && currentUser

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer
        linking={customLinking}
        ref={navigationRef}
        onReady={() => { 
          isReadyRef.current = true
          fullyAuthorized && navigationRef.current?.navigate('Tabs', { screen: 'Home', params: { screen: 'Feed' } })
          !loading && RNBootSplash.hide()
        }}
        // initialState={initialState}
        // onStateChange={state => console.log('!!! nav state:', state.routes)}
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