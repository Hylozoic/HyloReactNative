import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { HeaderBackButton } from '@react-navigation/stack'
import { get } from 'lodash/fp'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import Icon from 'components/Icon'
import {
  caribbeanGreen,
  white60onCaribbeanGreen,
  rhino60,
  rhino20,
  havelockBlue
} from 'style/colors'

export const tintColor = rhino60

export const buildScreenOptionsForWorkflow = params => ({
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: caribbeanGreen,
    shadowColor: 'transparent'          
  },
  headerTitleStyle: {
    color: 'white',
    fontFamily: 'Circular-Bold',
    fontSize: 12          
  },
  headerTintColor: white60onCaribbeanGreen,
  ...params
})

export function HeaderLeftCloseIcon ({ onPress, disableOnClick } ) {
  if (typeof onPress !== 'function') throw new Error('LeftHeaderClose: onPress is not a function.')
  
  return (
    <TouchableOpacity
      style={{ marginRight: 12 }}
      onPress={onPress}
      hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
      disabled={disableOnClick}
    >
      <Icon name='Ex' style={styles.exIcon} />
    </TouchableOpacity>
  )
}

export function HeaderRightButton ({
  onPress,
  text,
  disableOnClick = true
}) {
  if (typeof onPress !== 'function') throw new Error('HeaderRightButton: onPress is not a function.')
  
  return (
    <TouchableOpacity
      style={{ marginRight: 12 }}
      onPress={onPress}
      hitSlop={{ top: 7, bottom: 7, left: 7, right: 7 }}
      disabled={disableOnClick}
    >
      {text === 'Close'
        ? <Icon name='Ex' style={styles.exIcon} />
        : <Text style={[styles.button, disableOnClick && styles.disabled]}>{text}</Text>}
    </TouchableOpacity>
  )
}

// Helps to standardise the appearance and behaviour of headers.
// Accepts an options argument and the navigation object from the component:
//
//   const headerOptions = {
//     left: 'close',
//     right: {
//       onPress: () => alert('hi'),
//       text: 'Say hi'
//     },
//     title: 'This will override title set in navigation'
//   }
//
//   export default class WombatDirectory extends Component {
//     static navigationOptions = ({ navigation, route }) => header(navigation, route, headerOptions)
//
// left can either be an object or the string 'close' which will render a close
// button with onPress={() => goBack()}.
//
// The options object can be omitted entirely if you need a simple header with a back arrow,
// and you already have title set in navigation.
//
// If you need the action of the right button to come from the connector (for
// example something that requires dispatch) you'll need to set it from
// componentDidMount. For example:
//
//   componentDidMount () {
//     const right = {
//       onPress: this.props.myDispatchedFunc,
//       text: 'Dispatch me'
//     }
//     navigation.setParams({ headerRight: <HeaderRightButton {...right} /> })
//   }
//
// This can all be placed in the connector and passed via mapDispatchToProps.
// Of course, if you need even more customisation than this, don't use the
// helper (or override parts of it using setParams in the component).


// const headerLeft = editing
//   ? () => (
//       <HeaderBackButton
//         label={''}
//         onPress={() => confirmDiscardChanges({ onDiscard: navigation.goBack })}
//       />
//     )
//   : () => <HeaderBackButton label={' '} onPress={navigation.goBack} />

export function buildScreenOptions ({
  headerLeftCloseIcon = false,
  headerLeftOnPress: providedHeaderLeftOnPress,
  headerLeftConfirm = false,
  headerRightButtonLabel = 'Save',
  headerRightButtonOnPress,
  headerRightButtonDisabled = false,
  ...otherOptions
}) {

  const options = {}

  options.headerLeft = props => {
    const headerLeftOnPress = providedHeaderLeftOnPress || props.onPress
    const onPress = headerLeftConfirm
      ? () => confirmDiscardChanges({ onDiscard: headerLeftOnPress })
      : headerLeftOnPress

    return headerLeftCloseIcon
      ? <HeaderLeftCloseIcon {...props} onPress={onPress} />
      : <HeaderBackButton {...props} onPress={onPress} />
  }

  if (headerRightButtonOnPress) {
    options.headerRight = () => (
      <HeaderRightButton
        onPress={headerRightButtonOnPress}
        text={headerRightButtonLabel}
        disableOnClick={headerRightButtonDisabled}
      />
    )
  }

  return {
    ...options,
    ...otherOptions
  }
}

export default function header ({ goBack }, { params }, { headerBackButton, left, right, title, options, disableOnClick } = {}) {
  const headerOptions = {
    ...params,
    headerStyle: styles.headerStyle,
    headerTintColor: tintColor,
    title: title || get('title', params),
    headerTitleStyle: styles.headerTitleStyle,
    // Defaults
    headerBackTitle: null,
    headerLeft: null,
    headerRight: null,
    ...options
  }
  if (right) headerOptions.headerRight = () => (
    <HeaderRightButton {...right} disableOnClick={disableOnClick} />
  )
  if (left) {
    headerOptions.headerLeft = () =>
      left === 'close'
        ? <HeaderLeftCloseIcon onPress={goBack} />
        : <HeaderRightButton {...left} disableOnClick={disableOnClick} />
  }
  if (headerBackButton) {
    headerOptions.headerLeft = () => (
      <HeaderBackButton onPress={headerBackButton} tintColor={tintColor} />
    )
  }

  return headerOptions
}

const styles = StyleSheet.create({
  button: {
    fontFamily: 'Circular-Book',
    fontSize: 16,
    paddingTop: 1,
    color: havelockBlue,
    fontWeight: 'bold'
  },
  disabled: {
    color: rhino20
  },
  headerStyle: {
    backgroundColor: 'white'
  },
  headerTitleStyle: {
    color: 'black',
    fontFamily: 'Circular-Bold',
    fontSize: 17
  },
  exIcon: {
    fontSize: 20,
    padding: 7
  }
})
