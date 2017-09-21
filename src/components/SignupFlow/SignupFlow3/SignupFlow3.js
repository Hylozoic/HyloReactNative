import React from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView
} from 'react-native'
import Button from '../../Button'
import SignupControl from '../SignupControl'
import styles from './SignupFlow3.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class SignupFlow3 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 3/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor
  })

  render () {
    const { location, changeSetting, saveAndNext } = this.props

    return <KeyboardAvoidingView style={styles.container} {...kavProps}>
      <View>
        <Text style={styles.title}>Add your location</Text>
        <Text style={styles.subTitle}>
          Add your location to see more relevant content and find people and projects near you.
        </Text>
      </View>
      <SignupControl
        label='Where do you lay your head'
        value={location}
        onChange={changeSetting('location')} />
      <Button
        style={styles.continueButton}
        text='Continue'
        onPress={saveAndNext} />
    </KeyboardAvoidingView>
  }
}
