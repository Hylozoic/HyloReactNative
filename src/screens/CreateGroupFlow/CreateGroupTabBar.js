import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LayoutAnimation, View, Animated, Keyboard } from 'react-native'
import Button from 'components/Button'
import { useSelector } from 'react-redux'
import { getWorkflowOptions } from 'screens/CreateGroupFlow/CreateGroupFlow.store'
import { isIOS } from 'util/platform'
import {
  caribbeanGreen, rhino30, white, white20onCaribbeanGreen, white40onCaribbeanGreen
} from 'style/colors'
import { useKeyboard } from '@react-native-community/hooks'

export default function CreateGroupTabBar ({ state, descriptors, navigation }) {
  const workflowOptions = useSelector(getWorkflowOptions)
  const disableContinue = !!workflowOptions?.disableContinue
  const [completeButtonDisabled, setCompleteButtonDisabled] = useState(false)
  const prevStepScreenName = state.routeNames[state.index - 1]
  const nextStepScreenName = state.routeNames[state.index + 1]
  const currentStepRouteKey = state.routes[state.index].key
  const keyboard = useKeyboard()
  const [keyboardWillShow, setKeyboardWillShow] = useState(false)

  useEffect(() => {
    const willShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing]
      ))
      setKeyboardWillShow(true)
    })
    const willHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing]
      ))
      setKeyboardWillShow(false)      
    })
    return () => {
      willShowSubscription.remove()
      willHideSubscription.remove()
    }
  }, [])

  const gotoPrevStep = () => {
    setCompleteButtonDisabled(false)
    prevStepScreenName && navigation.navigate({ name: prevStepScreenName, merge: true })
  }

  const gotoNextStep = () =>
    nextStepScreenName && navigation.navigate({ name: nextStepScreenName, merge: true })

  const completeWorkflow = () => {
    navigation.emit({
      type: 'tabPress',
      target: currentStepRouteKey,
      canPreventDefault: true
    })
    setCompleteButtonDisabled(true)
  }

  const keyboardAdjustedHeight = keyboardWillShow
    ? keyboard.keyboardHeight + (isIOS ? 60 : 40)
    : (isIOS ? 80 : 60)

  return (
    <View style={[styles.container, { height: keyboardAdjustedHeight }]}>
      {prevStepScreenName && (
        <Button
          text='< Back'
          onPress={gotoPrevStep}
          style={styles.backButton}
        />
      )}
      {nextStepScreenName && (
        <Button
          text='Continue'
          onPress={gotoNextStep}
          style={styles.continueButton}
          disabled={disableContinue}
        />
      )}
      {!nextStepScreenName && (
        <Button
          text="Let's Do This!"
          onPress={completeWorkflow}
          disabled={completeButtonDisabled}
          style={styles.continueButton}
        />
      )}
    </View>
  )
}

const styles = {
  container: {
    backgroundColor: white20onCaribbeanGreen,
    paddingTop: 10,
    // paddingBottom: isIOS ? 30 : 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  backButton: {
    width: 100,
    height: 40,
    fontSize: 16,
    backgroundColor: white40onCaribbeanGreen,
    color: white,
    paddingBottom: isIOS ? 30 : 10,
  },
  continueButton: {
    paddingBottom: isIOS ? 30 : 10,
    marginLeft: 'auto',
    width: 134,
    height: 40,
    fontSize: 16,
    color: caribbeanGreen,
    backgroundColor: white,
    disabledColor: white,
    disabledBackgroundColor: rhino30
  }
}

// const onPress = () => {
//   const event = navigation.emit({
//     type: 'tabPress',
//     target: currentStepRouteKey,
//     canPreventDefault: true,
//     data: {
//       nextStepScreenName
//     }
//   })
//   if (!event.defaultPrevented) {
//     navigation.navigate({ name: nextStepScreenName, merge: true })
//   }
// }

