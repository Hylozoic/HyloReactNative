import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { func, string } from 'prop-types'

import { persimmon } from '../../style/colors'

export default class NotificationOverlay extends React.Component {
  static propTypes = {
    message: string.isRequired,
    onPress: func
  }

  constructor () {
    super()
    this.state = {
      heightAnim: new Animated.Value(0)
    }
  }

  componentDidMount () {
    this.animate()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.message !== this.props.message) {
      this.animate()
    }
  }

  animate () {
    const height = lineHeight + padding * 2
    Animated.sequence([
      Animated.timing(
        this.state.heightAnim,
        { toValue: height, duration: 800 }
      ),
      Animated.delay(4000),
      Animated.timing(
        this.state.heightAnim,
        { toValue: 0, duration: 800 }
      )
    ]).start()
  }

  render () {
    return <Animated.View style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 3, // Android only
      height: this.state.heightAnim
    }}>
      <TouchableOpacity onPress={this.props.onPress}>
        <Text style={styles.message}>{this.props.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  }
}

const fontSize = 16
const lineHeight = 20
const padding = 10

const styles = StyleSheet.create({
  message: {
    backgroundColor: persimmon,
    color: 'white',
    fontFamily: 'Circular-Bold',
    fontSize,
    // Note: letterSpacing not supported on Android
    letterSpacing: 0.2,
    lineHeight,
    padding,
    textAlign: 'center'
  }
})
