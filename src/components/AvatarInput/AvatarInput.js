import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { func, shape, string } from 'prop-types'

import Avatar from '../Avatar'

import { rhino30 } from '../../style/colors'
import styles from './AvatarInput.style'

const MAX_INPUT_HEIGHT = 100

export default class extends React.PureComponent {
  static propTypes = {
    avatarUrl: string,
    scrollParentToEnd: func
  }

  constructor () {
    super()
    this.state = { inputHeight: null }
  }

  handleContentSizeChange = ({ nativeEvent }) => {
    const { height } = nativeEvent.contentSize
    this.setState({
      inputHeight: height > MAX_INPUT_HEIGHT ? MAX_INPUT_HEIGHT : height
    })
    if (this.props.scrollParentToEnd) this.props.scrollParentToEnd()
  }

  render () {
    const inputProps = {
      // Can be overridden by setting on component
      placeholderTextColor: rhino30,
      returnKeyLabel: 'send',

      ...this.props,

      // Cannot be overridden
      onContentSizeChange: this.handleContentSizeChange,
      underlineColorAndroid: 'transparent',
      style: { ...styles.input, height: this.state.inputHeight }
    }
    return <View style={styles.container}>
      <Avatar avatarUrl={this.props.avatarUrl} />
      <TextInput { ...inputProps } />
    </View>
  }
}
