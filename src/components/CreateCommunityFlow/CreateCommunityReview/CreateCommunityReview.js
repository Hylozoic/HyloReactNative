import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import ErrorBubble from '../../ErrorBubble'
import createCommunityHeader from '../util/createCommunityHeader'
import styles from '../CreateCommunityFlow.styles'

export default class CreateCommunityReview extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const title = 'STEP 3/3'
    return createCommunityHeader(title, navigation)
  }

  constructor (props) {
    super(props)
    this.state = {
      communityName: this.props.communityName,
      communityUrl: this.props.communityUrl,
      error: null
    }
  }

  submit = () => {
    const { communityName, communityUrl } = this.state
    this.props.createCommunity(communityName, communityUrl)
    .then((data) => {
      if (data.error) {
        this.setState({
          error: 'There was an error, please try again.'
        })
        return
      }
      this.props.clearNameAndUrlFromStore()
      this.props.goToCommunity(data.payload.data.createCommunity.community)
    })
  }

  render () {
    const { error } = this.state
    return <ScrollView>
      <KeyboardFriendlyView style={styles.container}>
        <Text style={styles.header}>Everything look good?</Text>
        <Text style={styles.description}>You can always come back and change your details at any time</Text>
        <View style={styles.reviewTextInputContainer}>
          <Text style={styles.textInputLabel}>Whats the name of your community?</Text>
          <View style={styles.textInputWithButton}>
            <TextInput
              style={styles.reviewTextInput}
              value={this.state.communityName}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
            <TouchableOpacity onPress={this.props.goToCreateCommunityName} style={styles.editContainer}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.secondTextInputContainer}>
          <Text style={styles.textInputLabel}>Whats the url of your community?</Text>
          <View style={styles.textInputWithButton}>
            <TextInput
              style={styles.reviewTextInput}
              value={this.state.communityUrl}
              underlineColorAndroid={styles.androidInvisibleUnderline}
              disabled
            />
            <TouchableOpacity onPress={this.props.goToCreateCommunityUrl} style={styles.editContainer}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        {error && <View style={styles.errorBubble}><ErrorBubble text={error} /></View> }
        <Button text="Let's Do This!" onPress={this.submit} style={styles.button} disabled={!!this.props.createCommunityPending} />
      </KeyboardFriendlyView>
    </ScrollView>
  }
}
