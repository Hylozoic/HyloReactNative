import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
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
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Everything look good?</Text>
      <Text style={styles.description}>You can always come back and change your details at any time</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityName => this.setInput('communityName', communityName)}
          returnKeyType='next'
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      <View style={styles.secondTextInputContainer}>
        <Text style={styles.textInputLabel}>Whats the url of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityName => this.setInput('communityName', communityName)}
          returnKeyType='next'
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}
