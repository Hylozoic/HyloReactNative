import React from 'react'
import {
  Text, TouchableOpacity, Animated
} from 'react-native'
import Loading from '../Loading'
import styles from './LoadingModal.styles'

export default class LoadingModal extends React.Component {
  state = {
    opacityAnim: new Animated.Value(0),
    visible: false
  }

  componentWillReceiveProps (nextProps) {
    const { display } = nextProps
    if (display) {
      this.setState({ visible: true })
    }

    Animated.timing(this.state.opacityAnim,
      {
        toValue: display ? 0.8 : 0,
        duration: 700
      }).start(() => {
        this.setState({visible: nextProps.display})
      })
  }

  render () {
    const { setLoadingModal } = this.props
    const { opacityAnim, visible } = this.state

    if (!visible) return null

    return <Animated.View style={{
      ...styles.container,
      opacity: opacityAnim
    }}>
      <Loading />
      <TouchableOpacity onPress={() => setLoadingModal(false)} ><Text>CLOSE</Text></TouchableOpacity>
    </Animated.View>
  }
}
