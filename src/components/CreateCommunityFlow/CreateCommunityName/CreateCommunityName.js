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

export default class CreateCommunityName extends React.Component {
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

  constructor (props) {
    super(props)
    this.state = {
      communityName: null
    }
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  checkAndSubmit = () => {
    this.props.saveCommunityName(this.state.communityName)
  }

  render () {
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Lets get started!</Text>
      <Text style={styles.description}>All good things start somewhere! Lets kick things off with a catchy name for your community.</Text>
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
      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={false} />
    </KeyboardFriendlyView>
  }
}
