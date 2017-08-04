import React from 'react'
import { Animated, StyleSheet, Text } from 'react-native'
import { bool, string } from 'prop-types'

import { persimmon } from '../style/colors'

export default class Thread extends React.Component {
  static propTypes = {
    message: string.isRequired,
    visible: bool.isRequired
  }

  constructor () {
    super()
    this.state = {
      opacityAnim: new Animated.Value(0),
      heightAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(
        this.state.opacityAnim,
        { toValue: 1, duration: 2000 }
      ),
      Animated.timing(
        this.state.heightAnim,
        { toValue: fontSize + padding * 2, duration: 2000 }
      )
    ]).start()
  }

  render () {
    return <Animated.View style={{
      height: this.state.heightAnim,
      opacity: this.state.opacityAnim
    }}>
      <Text style={styles.message}>{this.props.message}</Text>
    </Animated.View>
  }
}

const fontSize = 16
const padding = 10

const styles = StyleSheet.create({
  message: {
    backgroundColor: persimmon,
    color: 'white',
    fontFamily: 'Circular-Bold',
    fontSize,
    // Note: letterSpacing not supported on Android
    letterSpacing: 0.2,
    padding,
    textAlign: 'center'
  }
})
