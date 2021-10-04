import React, { useMemo } from 'react'
import { pick } from 'lodash/fp'
import { View } from 'react-native'
import { caribbeanGreen, rhino20, rhino30, rhino80, white, white20onCaribbeanGreen, white40onCaribbeanGreen } from 'style/colors'
import Button from 'components/Button'
import { useSelector } from 'react-redux'
import { getContinueButtonProps } from 'screens/CreateGroupFlow/CreateGroupFlow.store'

export default function CreateGroupTabBar ({ state, descriptors, navigation }) {
  const continueButtonProps = useSelector(getContinueButtonProps)
  const prevStepScreenName = state.routeNames[state.index - 1]
  const nextStepScreenName = state.routeNames[state.index + 1]
  const currentStepRouteKey = state.routes[state.index].key

  const gotoPrevStep = () =>
    prevStepScreenName && navigation.navigate({ name: prevStepScreenName, merge: true })

  const gotoNextStep = () =>
    nextStepScreenName && navigation.navigate({ name: nextStepScreenName, merge: true })

  console.log('!!! continue button props', continueButtonProps)

  return (
    <View style={{
      backgroundColor: white20onCaribbeanGreen,
      paddingTop: 10,
      paddingBottom: 40,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      {prevStepScreenName && (
        <Button
          text='< Back'
          onPress={gotoPrevStep}
          style={{
            width: 100,
            height: 40,
            fontSize: 16,
            backgroundColor: white40onCaribbeanGreen,
            color: white,
          }}
        />
      )}
      {nextStepScreenName && (
        <Button
          text='Continue'
          onPress={nextStepScreenName && gotoNextStep}
          disabled
          style={{
            marginLeft: 'auto',
            width: 134,
            height: 40,
            fontSize: 16,
            color: caribbeanGreen,
            backgroundColor: white,
            disabledColor: white,
            disabledBackgroundColor: rhino30
          }}
          {...pick(['text', 'disabled'], continueButtonProps)}
        />
      )}
    </View>
  )
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
