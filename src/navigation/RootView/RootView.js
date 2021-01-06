import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { getActionFromState } from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native'
import linking, { getStateFromReturnToPath } from 'navigation/linking'
import Loading from 'components/Loading'
import AuthNavigator from 'navigation/AuthNavigator'
import AppWithDrawerNavigator from 'navigation/AppWithDrawerNavigator'
import setReturnToPath from 'store/actions/setReturnToPath'
import { reset, navigate, navigationRef, isReadyRef } from 'navigation/RootNavigation'

export default function RootView ({
  loading,
  signedIn,
  signupInProgress,
  checkSessionAndSetSignedIn,
  loadCurrentUserSession,
  returnToPath,
  openedPushNotification
}) {
  const dispatch = useDispatch()
  const [initialState, setInitialState] = useState()

  useEffect(() => { checkSessionAndSetSignedIn() }, [])
  useEffect(() => { signedIn && loadCurrentUserSession() }, [signedIn])
  useEffect(() => { 
    if (!loading && signedIn && !signupInProgress && returnToPath && navigationRef?.current) {
      // setInitialState(linking.getStateFromPath(returnToPath))
      // reset(linking.getStateFromPath(returnToPath))
      const state = linking.getStateFromPath(returnToPath)
      const action = getActionFromState(state)
      console.log('!!! action:', action)

      navigationRef.current.dispatch(action)
      // dispatch(setReturnToPath(null))
    }
  }, [loading, signedIn, signupInProgress, returnToPath, navigationRef])

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
        // initialState={initialState}
        linking={linking}
        ref={navigationRef}
        onReady={() => { isReadyRef.current = true }}
      >
        {signedIn && !signupInProgress
          ? <AppWithDrawerNavigator />
          : <AuthNavigator signupInProgress={signupInProgress} />}
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