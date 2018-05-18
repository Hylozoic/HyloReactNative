/**
 * @providesModule util/header
 */
import React, { PureComponent } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { rhino60, rhino20, havelockBlue } from 'style/colors'
import Icon from '../components/Icon'
import { get } from 'lodash/fp'

export const tintColor = rhino60

export class HeaderButton extends PureComponent {
  constructor (props) {
    super(props)
    const { disabled } = props
    this.state = {
      disabled
    }
  }

  static defaultProps = {
    disableOnClick: true
  }

  componentDidUpdate (prevProps) {
    const { disabled } = this.props
    if (disabled !== prevProps.disabled) {
      this.setState({disabled})
    }
  }

  onPress = () => {
    const { disableOnClick } = this.props
    if (disableOnClick === true) {
      this.setState({disabled: true})
    }
    this.props.onPress()
  }
  render () {
    const { onPress, text } = this.props
    const { disabled } = this.state

    if (typeof onPress !== 'function') throw new Error('HeaderButton: onPress is not a function.')
    return <TouchableOpacity onPress={this.onPress} hitSlop={{top: 7, bottom: 7, left: 7, right: 7}} disabled={disabled} >
      {text === 'Close'
        ? <Icon name='Ex' style={styles.exIcon} />
        : <Text style={[styles.button, disabled && styles.disabled]}>{text}</Text>}
    </TouchableOpacity>
  }
}

const headerClose = goBack => <HeaderButton onPress={() => goBack()} text='Close' />

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
//     navigation.setParams({ headerRight: <HeaderButton {...right} /> })
//   }
//
// This can all be placed in the connector and passed via mapDispatchToProps.
// Of course, if you need even more customisation than this, don't use the
// helper (or override parts of it using setParams in the component).
export default function header ({ goBack, state }, { headerBackButton, left, right, title, options, disableOnClick } = {}) {
  const headerOptions = {
    ...state.params,
    headerStyle: styles.header,
    headerTintColor: tintColor,
    headerTitle: title || get('params.title', state),
    headerTitleStyle: styles.title,
    headerBackTitle: null,
    ...options
  }
  if (left) {
    headerOptions.headerLeft = left === 'close' ? headerClose(goBack) : <HeaderButton {...left} disableOnClick={disableOnClick} />
    headerOptions.headerTitleStyle = [ styles.title, styles.center ]
  }
  if (right) headerOptions.headerRight = <HeaderButton {...right} disableOnClick={disableOnClick} />

  if (headerBackButton) {
    headerOptions.headerLeft = <HeaderBackButton
      onPress={headerBackButton}
      tintColor={tintColor} />
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
  center: {
    alignSelf: 'center',
    flex: 1,
    textAlign: 'center'
  },
  header: {
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },
  title: {
    color: 'black',
    fontFamily: 'Circular-Bold',
    fontSize: 17
  },
  exIcon: {
    fontSize: 20,
    padding: 7
  }
})
