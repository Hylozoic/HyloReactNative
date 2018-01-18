import React from 'react'
import {
  Text,
  View,
  TextInput
} from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import ErrorBubble from '../../ErrorBubble'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import header from 'util/header'
import { slugValidatorRegex, invalidSlugMessage } from '../util'
import Button from '../../Button'
import styles from '../CreateCommunityFlow.styles'
import { caribbeanGreen, white, white60onCaribbeanGreen } from 'style/colors'

export default class CreateCommunityUrl extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Step 2/3',
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
      communityUrl: this.props.communityUrl
    }
  }

  setInput (key, value) {
    this.setState({
      ...this.state,
      [key]: value
    })
  }

  clearErrors = () => {
    this.setState({
      ...this.state,
      error: null
    })
  }

  checkAndSubmit = () => {
    const { communityUrl } = this.state

    this.clearErrors()
    if (!communityUrl || communityUrl.length === 0) {
      this.setState({
        ...this.state,
        error: 'Please enter a URL'
      })
      return
    }
    if (!slugValidatorRegex.test(communityUrl)) {
      this.setState({
        ...this.state,
        error: invalidSlugMessage
      })
      return
    }
    this.props.fetchCommunityExists(communityUrl)
    .then(({ error }) => {
      if (error) {
        this.setState({
          error: 'There was an error, please try again.'
        })
      }
      if (this.props.urlExists === false) {
        this.props.saveCommunityUrl(communityUrl)
        this.props.goToCreateCommunityReview()
      } else {
        this.setState({
          ...this.state,
          error: 'This url already exists. Please choose another one.'
        })
      }
    })
  }

  render () {
    const { error } = this.state
    return <KeyboardFriendlyView style={styles.container}>
      <Text style={styles.header}>Choose an address for your community</Text>
      <Text style={styles.description}>Your URL is the address that members will use to access your community online. The shorter the better!</Text>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={communityUrl => this.setInput('communityUrl', communityUrl)}
          returnKeyType='next'
          autoCapitalize='none'
          value={this.state.communityUrl}
          autoCorrect={false}
          underlineColorAndroid={styles.androidInvisibleUnderline} />
      </View>
      {error && <ErrorBubble styles={null} text={error} />}
      <Button text='Continue' onPress={this.checkAndSubmit} style={styles.button} disabled={!!this.props.fetchUrlPending} />
    </KeyboardFriendlyView>
  }
}
