import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native'

import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityReview extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return <View style={styles.container}>
      <Text>Review</Text>
      <Text>Review and make changes below.</Text>
      <TouchableOpacity>
        <Button title='Continue' onPress={() => console.log('click')} />
      </TouchableOpacity>
    </View>
  }
}
