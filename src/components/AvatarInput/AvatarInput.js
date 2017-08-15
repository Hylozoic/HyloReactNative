import React from 'react'
import { Image, TextInput, TouchableOpacity, View } from 'react-native'
import { bool, func, string } from 'prop-types'

import Icon from '../Icon'
import { jade, rhino30 } from '../../style/colors'
import styles from './AvatarInput.style'

const MIN_INPUT_HEIGHT = 22
const MAX_INPUT_HEIGHT = 100

export default class extends React.PureComponent {
  static propTypes = {
    avatarUrl: string,
    blurOnSubmit: bool,
    multiline: bool,
    onSubmit: func,
    placeholder: string
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
    this.textInput.clear()
    this.setState({
      text: '',
      submittable: false
    })
  }

  handleChange = ({ nativeEvent: { text } }) => {
    this.setState({
      submittable: text.trim().length > 0,
      text
    })
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

  render () {
    const inputProps = {
      // Can be overridden by setting on component
      placeholderTextColor: rhino30,
      returnKeyLabel: 'send',

      ...this.props,

      // Cannot be overridden
      onChange: this.handleChange,
      onContentSizeChange: this.handleContentSizeChange,
      underlineColorAndroid: 'transparent',
      ref: ti => this.textInput = ti,
      style: { ...styles.input, height: this.restrictedHeight() },
      value: this.state.text
    }
    const { onSubmit } = this.props
    const { submittable } = this.state
    const iconStyle = { ...styles.sendButton, color: submittable ? jade : rhino30 }

    return <View style={styles.container}>
      <TextInput { ...inputProps } />
      <TouchableOpacity onPress={this.handleSubmit}>
        <Icon name='Send' style={iconStyle} />
      </TouchableOpacity>
    </View>
  }
}
