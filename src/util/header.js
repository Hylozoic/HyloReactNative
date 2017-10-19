/**
 * @providesModule util/header
 */
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import { rhino60 } from 'style/colors'

export const headerButton = ({ onPress, text }) => {
  if (typeof onPress !== 'function') throw new Error('headerButton: onPress is not a function.')
  return <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{text}</Text>
  </TouchableOpacity>
}

// Called from one of the main tab screens to display or hide icon badges
export const updateBadges = ({ setParams }, currentUser, prevUser) => {
  if (typeof setParams !== 'function') {
    throw new Error('updateBadges: setParams is not a function. Did you pass the navigation object?')
  }
  if (!currentUser) return
  const shouldUpdateBadges = !prevUser ||
    currentUser.unseenThreadCount !== prevUser.unseenThreadCount ||
    currentUser.newNotificationCount !== prevUser.newNotificationCount
  if (shouldUpdateBadges) {
    setParams({
      hasUnreadMessages: !!currentUser.unseenThreadCount,
      hasUnreadNotifications: !!currentUser.newNotificationCount
    })
  }
}

const headerClose = goBack => headerButton({ onPress: () => goBack(), text: 'Close' })

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
//     static navigationOptions = ({ navigation }) => header(navigation, headerOptions)
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
//     navigation.setParams({ headerRight: headerButton(right) })
//   }
//
// This can all be placed in the connector and passed via mapDispatchToProps.
// Of course, if you need even more customisation than this, don't use the
// helper (or override parts of it using setParams in the component).
export default function header ({ goBack, state }, { left, right, title } = {}) {
  const headerOptions = {
    ...state.params,
    headerStyle: styles.header,
    headerTintColor: rhino60,
    headerTitle: title || state.params.title,
    headerTitleStyle: styles.title
  }
  if (left) {
    headerOptions.headerLeft = left === 'close' ? headerClose(goBack) : headerButton(left)
    headerOptions.headerTitleStyle = [ styles.title, styles.center ]
  }
  if (right) headerOptions.headerRight = headerButton(right)

  return headerOptions
}

const styles = StyleSheet.create({
  button: {
    fontFamily: 'Circular-Book',
    fontSize: 15,
    color: rhino60
  },
  center: {
    alignSelf: 'center'
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },
  title: {
    color: 'black',
    fontFamily: 'Circular-Bold',
    fontSize: 17,
    marginLeft: 15

    // Required to avoid font-weight bug where RN goes looking for
    // CustomFontName_bold.ttf, which doesn't exist:
    // https://github.com/react-community/react-navigation/issues/542#issuecomment-283663786
    // fontWeight: '200'
  }
})
