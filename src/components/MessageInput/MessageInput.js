import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { bool, func, string } from 'prop-types'
import { throttle } from 'lodash'

import Icon from '../Icon'
import { jade, rhino30 } from '../../style/colors'
import styles from './MessageInput.style'

const IS_TYPING_THROTTLE = 3000
const MIN_INPUT_HEIGHT = 22
const MAX_INPUT_HEIGHT = 100

export default class extends React.PureComponent {
  static propTypes = {
    blurOnSubmit: bool,
    multiline: bool,
    onSubmit: func,
    placeholder: string,
    sendIsTyping: func
  }

  constructor () {
    super()
    this.state = {
      inputheight: MIN_INPUT_HEIGHT,
      submittable: false,
      text: ''
    }
  }

  clear = () => {
    this.setState({
      text: '',
      submittable: false
    })
    this.textInput.clear()
  }

  handleChange = ({ nativeEvent: { text } }) => {
    const { onChange } = this.props
    this.startTyping()
    this.setState({
      submittable: text.trim().length > 0,
      text
    })
    onChange && onChange(text)
  }

  handleContentSizeChange = ({ nativeEvent }) =>
    this.setState({ inputHeight: nativeEvent.contentSize.height })

  handleSubmit = () => {
    const { text, submittable } = this.state
    // NOTE: The calling code is responsible for sanitisation.
    if (submittable) this.props.onSubmit(text)
    this.clear()
  }

  restrictedHeight = () => Math.min(
    MAX_INPUT_HEIGHT,
    Math.max(MIN_INPUT_HEIGHT, this.state.inputHeight)
  )

  startTyping = throttle(() => this.props.sendIsTyping && this.props.sendIsTyping(), IS_TYPING_THROTTLE)

  render () {
    const inputProps = {
      // Can be overridden by setting on component
      placeholderTextColor: rhino30,
      value: this.state.text,
      ...this.props,

      // Cannot be overridden
      onChange: this.handleChange,
      onContentSizeChange: this.handleContentSizeChange,
      underlineColorAndroid: 'transparent',
      ref: ti => { this.textInput = ti },
      style: { ...styles.input, height: this.restrictedHeight() }
    }
    const { submittable } = this.state
    const iconStyle = { ...styles.sendButton, color: submittable ? jade : rhino30 }

    return <View style={styles.container}>
      <TextInput {...inputProps} />
      <TouchableOpacity onPress={this.handleSubmit}>
        <Icon name='Send' style={iconStyle} />
      </TouchableOpacity>
    </View>
  }
}
