import React, { useEffect, useState } from 'react'
import { LayoutAnimation, View, Keyboard, Alert } from 'react-native'
import Button from 'components/Button'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { getWorkflowOptions, getCurrentStepIndex, getRouteNames, decrementCurrentStepIndex, incrementCurrentStepIndex, GROUP_WELCOME_AGREEMENTS, GROUP_WELCOME_JOIN_QUESTIONS } from 'screens/GroupWelcomeFlow/GroupWelcomeFlow.store'
import { isIOS } from 'util/platform'
import isEmpty from 'lodash/isEmpty'
import {
  caribbeanGreen, rhino30, white, white20onCaribbeanGreen, white40onCaribbeanGreen
} from 'style/colors'
import { useKeyboard } from '@react-native-community/hooks'
import { ALL_GROUP } from 'store/models/Group'

export default function GroupWelcomeTabBar ({ group, acceptedAllAgreements, agreements, handleAccept, allQuestionsAnswered }) {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const workflowOptions = useSelector(getWorkflowOptions)
  const currentStepIndex = useSelector(getCurrentStepIndex)
  const disableContinue = !!workflowOptions?.disableContinue
  const [completeButtonDisabled, setCompleteButtonDisabled] = useState(false)

  const routeNames = getRouteNames(group)
  const prevStepScreenName = routeNames[currentStepIndex - 1]
  const nextStepScreenName = routeNames[currentStepIndex + 1]
  const currentStepName = routeNames[currentStepIndex]
  const keyboard = useKeyboard()
  const [keyboardWillShow, setKeyboardWillShow] = useState(false)

  const onAgreementStepButNotReady = currentStepName === GROUP_WELCOME_AGREEMENTS && !acceptedAllAgreements
  const onJoinQuestionStepButNotReady = currentStepName === GROUP_WELCOME_JOIN_QUESTIONS && !allQuestionsAnswered

  useEffect(() => {
    const willShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.scaleXY
      ))
      setKeyboardWillShow(true)
    })
    const willHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.create(
        e.duration,
        LayoutAnimation.Types[e.easing],
        LayoutAnimation.Properties.scaleXY
      ))
      setKeyboardWillShow(false)
    })
    return () => {
      willShowSubscription.remove()
      willHideSubscription.remove()
    }
  }, [])

  const handleBackOut = async () => {
    const enforceAgreements = !isEmpty(agreements)
    let explainerText = 'There are still some required steps before you can view group contents'
    if (onAgreementStepButNotReady) {
      explainerText = 'To view the group contents, you have to adhere to the group agreements'
    }
    if (onJoinQuestionStepButNotReady) {
      explainerText = 'Please answer all the join questions to continue'
    }
    const getOutTitle = enforceAgreements ? 'Return Home' : 'Skip'
    const getOutFunc = enforceAgreements
      ? () => {
          navigation.navigate('Group Navigation', { groupSlug: ALL_GROUP.slug })
          navigation.navigate('Feed', { initial: false })
        }
      : () => completeWorkflow()
    Alert.alert(
      'Are you sure?',
      explainerText,
      [
        {
          text: 'Ok, I understand',
          onPress: () => {} // noop that closes alert
        },
        {
          text: getOutTitle,
          onPress: getOutFunc
        }
      ],
      { cancelable: false }
    )
  }

  const gotoPrevStep = () => {
    setCompleteButtonDisabled(false) // TOOD: is this even useful still?
    dispatch(decrementCurrentStepIndex())
  }

  const gotoNextStep = () => {
    dispatch(incrementCurrentStepIndex())
  }

  const completeWorkflow = () => {
    handleAccept()
    setCompleteButtonDisabled(true)
  }

  const keyboardAdjustedHeight = keyboardWillShow
    ? keyboard.keyboardHeight + (isIOS ? 60 : 40)
    : (isIOS ? 80 : 60)

  return (
    <View style={[styles.container, { height: keyboardAdjustedHeight }]}>
      {nextStepScreenName && (
        <Button
          text='Exit'
          onPress={handleBackOut}
          style={styles.backButton}
        />
      )}
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
          onPress={(onAgreementStepButNotReady || onJoinQuestionStepButNotReady) ? handleBackOut : gotoNextStep}
          style={styles.continueButton}
          disabled={disableContinue}
        />
      )}
      {!nextStepScreenName && (
        <Button
          text="Let's Do This!"
          onPress={(onAgreementStepButNotReady || onJoinQuestionStepButNotReady) ? handleBackOut : completeWorkflow}
          disabled={completeButtonDisabled}
          style={styles.continueButton}
        />
      )}
    </View>
  )
}

const buttonStyle = {
  height: 40,
  fontSize: 16,
  paddingBottom: isIOS ? 30 : 10
}

const styles = {
  container: {
    backgroundColor: white20onCaribbeanGreen,
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  backButton: {
    ...buttonStyle,
    width: 80,
    color: white,
    backgroundColor: white40onCaribbeanGreen,
    marginRight: 8
  },
  continueButton: {
    ...buttonStyle,
    width: 134,
    marginLeft: 'auto',
    color: caribbeanGreen,
    backgroundColor: white,
    disabledColor: white,
    disabledBackgroundColor: rhino30
  }
}
