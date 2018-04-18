/**
 * @providesModule util/toast
 */
import Toast from 'react-native-root-toast'
import { StyleSheet } from 'react-native'
import { defaults } from 'lodash'
import { white40onCaribbeanGreen, white } from 'style/colors'

let styles = StyleSheet.create({
  containerStyle: {
    padding: 10,
    backgroundColor: '#000',
    opacity: 1,
    borderRadius: 5
  },
  textStyle: {
    fontSize: 18,
    color: white,
    fontFamily: 'Circular-Bold',
    textAlign: 'center'
  }
})

/**
 * Passthrough to https://github.com/magicismight/react-native-root-toast with hylo default styles
 * @param {*} msg
 * @param {*} props
 */
export default function showToast (msg = 'Cheers!', props = {}) {
  const mergedProps = defaults(props, {
    duration: Toast.durations.LONG,
    position: 34,
    textStyle: styles.textStyle,
    containerStyle: styles.containerStyle,
    backgroundColor: white40onCaribbeanGreen,
    shadow: false,
    opacity: 1,
    animation: true,
    hideOnPress: true,
    delay: 0
  })
  return Toast.show(msg, mergedProps)
}

export function hideToast (toast) {
  Toast.hide(toast)
}
