import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'

export default class Signup extends React.Component {

  render () {
    const goToSignupFlow1 = () => {
      this.props.navigation.navigate('SignupFlow1')
    }

    return <View>
      <TouchableOpacity onPress={goToSignupFlow1}>
        <Text>SIGNUP</Text>
      </TouchableOpacity>
    </View>
  }
}
