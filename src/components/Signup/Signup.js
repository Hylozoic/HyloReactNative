import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

export default class Signup extends React.Component {

  render () {
    const { goToSignupFlow } = this.props
    return <View>
      <TouchableOpacity onPress={goToSignupFlow}>
        <Text>SIGNUP</Text>
      </TouchableOpacity>
    </View>
  }
}
