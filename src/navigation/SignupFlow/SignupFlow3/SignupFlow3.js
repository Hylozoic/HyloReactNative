import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import Button from 'components/Button'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import SettingControl from 'components/SettingControl'
import styles from './SignupFlow3.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class SignupFlow3 extends React.Component {
  saveAndNext = () => {
    this.control && this.control.blur()
    this.props.saveAndNext()
  }

  render () {
    const { location, changeSetting } = this.props

    return (
      <KeyboardFriendlyView style={styles.container} {...kavProps}>
        <ScrollView>
          <View>
            <Text style={styles.title}>Add your location</Text>
            <Text style={styles.subTitle}>
              Add your location to see more relevant content and find people and projects near you.
            </Text>
          </View>
          <SettingControl
            ref={c => { this.control = c }}
            label='Where do you call home'
            value={location}
            onChange={changeSetting('location')}
          />
          <Button
            style={styles.continueButton}
            text='Continue'
            onPress={this.saveAndNext}
          />
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}
