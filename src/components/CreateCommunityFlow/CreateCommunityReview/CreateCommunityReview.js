import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native'

import header from 'util/header'
import { HeaderBackButton } from 'react-navigation'
import styles from '../CreateCommunityFlow.styles'
import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'

export default class CreateCommunityReview extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Step 1/3',
      options: {
        headerLeft: <HeaderBackButton onPress={() => navigation.goBack()} tintColor={white60onCaribbeanGreen} />,
        headerBackTitle: null,
        headerBackgroundColor: white
      },
      customStyles: {
        header: {
          backgroundColor: caribbeanGreen,
          paddingHorizontal: 10
        },
        title: {
          color: white
        }
      }
    })
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
