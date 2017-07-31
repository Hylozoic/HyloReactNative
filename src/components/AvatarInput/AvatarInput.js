import React from 'react'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { func, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import { rhino30 } from '../../style/colors'
import styles from './AvatarInput.style'

const MIN_INPUT_HEIGHT = 22
const MAX_INPUT_HEIGHT = 100
const MAX_INPUT_LINES = 4

export default class extends React.PureComponent {
  static propTypes = {
    avatarUrl: string,
    scrollParentToEnd: func
  }

  constructor () {
    super()
    // Avoiding use of setState here as it would double-render on each content size change
    this.inputheight = MIN_INPUT_HEIGHT
  }

  handleContentSizeChange = ({ nativeEvent }) => {
    this.inputHeight = nativeEvent.contentSize.height
    if (this.props.scrollParentToEnd) this.props.scrollParentToEnd()
  }

  restrictHeight = () => Math.min(MAX_INPUT_HEIGHT, Math.max(MIN_INPUT_HEIGHT, this.inputHeight))

  render () {
    const inputProps = {
      // Can be overridden by setting on component
      placeholderTextColor: rhino30,
      returnKeyLabel: 'send',

      ...this.props,

      // Cannot be overridden
      onContentSizeChange: this.handleContentSizeChange,
      onChange: this.handleChange,
      underlineColorAndroid: 'transparent',
      style: { ...styles.input, height: this.restrictHeight() }
    }
    return <View style={styles.container}>
      <Avatar avatarUrl={this.props.avatarUrl} />
      <TextInput { ...inputProps } />
    </View>
  }
}
