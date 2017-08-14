import React from 'react'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { func, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import { rhino30 } from '../../style/colors'
import styles from './AvatarInput.style'

const MIN_INPUT_HEIGHT = 22
const MAX_INPUT_HEIGHT = 100

export default class extends React.PureComponent {
  static propTypes = {
    avatarUrl: string,
    scrollParentToEnd: func
  }

  constructor () {
    super()
    this.state = {
      inputheight: MIN_INPUT_HEIGHT
    }
  }

  handleContentSizeChange = ({ nativeEvent }) => {
    this.setState({
      inputHeight: nativeEvent.contentSize.height
    })
  }

  restrictedHeight = () => Math.min(
    MAX_INPUT_HEIGHT,
    Math.max(MIN_INPUT_HEIGHT, this.state.inputHeight)
  )

  clear = () => this.textInput.clear()

  onSubmitEditing = evt => {
    // TODO: grey out text while submitting?
    if (this.props.onSubmitEditing) this.props.onSubmitEditing(evt)
  }

  render () {
    const inputProps = {
      // Can be overridden by setting on component
      placeholderTextColor: rhino30,
      returnKeyLabel: 'send',

      ...this.props,

      // Cannot be overridden, but will call the parent function if provided
      onSubmitEditing: this.onSubmitEditing,

      // Cannot be overridden
      onContentSizeChange: this.handleContentSizeChange,
      underlineColorAndroid: 'transparent',
      ref: ti => this.textInput = ti,
      style: { ...styles.input, height: this.restrictedHeight() }
    }
    return <View style={styles.container}>
      <Avatar avatarUrl={this.props.avatarUrl} />
      <TextInput { ...inputProps } />
    </View>
  }
}
