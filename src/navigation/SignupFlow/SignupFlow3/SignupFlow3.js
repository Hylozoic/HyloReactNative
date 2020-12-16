import React from 'react'
import { View, Text } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import Button from 'components/Button'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import SettingControl from 'components/SettingControl'
import styles from './SignupFlow3.styles'

export default class SignupFlow3 extends React.Component {
  saveAndNext = () => {
    this.control && this.control.blur()
    this.props.saveAndNext()
  }

  render () {
    const { location, changeSetting } = this.props

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardFriendlyView {...kavProps}>
          <View styles={styles.header}>
            <Text style={styles.title}>Add your location</Text>
            <Text style={styles.subTitle}>
              Add your location to see more relevant content and find people and projects near you.
            </Text>
          </View>
          <View style={styles.content}>
            <SettingControl
              ref={c => { this.control = c }}
              label='Where do you call home'
              value={location}
              onChange={changeSetting('location')}
            />
          </View>
          <View style={styles.footer}>
            <Button
              style={styles.continueButton}
              text='Continue'
              onPress={this.saveAndNext}
            />
          </View>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}
