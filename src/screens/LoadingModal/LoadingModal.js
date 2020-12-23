import React from 'react'
import {
  Animated
} from 'react-native'
import Loading from 'components/Loading'
import styles from './LoadingModal.styles'

export default class LoadingModal extends React.Component {
  state = {
    opacityAnim: new Animated.Value(0),
    visible: false
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { shouldDisplay } = nextProps
    if (shouldDisplay) {
      this.setState({ visible: true })
    }

    Animated.timing(this.state.opacityAnim,
      {
        toValue: shouldDisplay ? 0.8 : 0,
        duration: 700,
        useNativeDriver: false
      }).start(() => {
      this.setState({ visible: nextProps.shouldDisplay })
    })
  }

  render () {
    const { opacityAnim, visible } = this.state

    if (!visible) return null

    return (
      <Animated.View
        useNativeDriver style={{
          ...styles.container,
          opacity: opacityAnim
        }}
      >
        <Loading />
      </Animated.View>
    )
  }
}
