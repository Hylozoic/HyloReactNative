import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from 'components/Button'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SettingControl from 'components/SettingControl'
import LocationPicker from 'screens/LocationPicker/LocationPicker'
import styles from './SignupFlow3.styles'


export default class SignupFlow3 extends React.Component {
  controlRef = React.createRef()

  saveAndNext = () => {
    this.controlRef.current && this.controlRef.current.blur()
    this.props.saveAndNext()
  }

  showLocationPicker = locationText  => {
    const { navigation, changeSetting } = this.props

    LocationPicker({
      navigation,
      initialSearchTerm: locationText,
      onPick: location => {
        changeSetting('location')(location?.fullText)
        changeSetting('locationId')(location?.id)
      }
    })
  }

  render () {
    const { location } = this.props

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <KeyboardFriendlyView>
            <View styles={styles.header}>
              <Text style={styles.title}>Add your location</Text>
              <Text style={styles.subTitle}>
                Add your location to see more relevant content and find people and projects near you.
              </Text>
            </View>
            <View style={styles.content}>
              <SettingControl
                ref={this.controlRef}
                label='Where do you call home'
                value={location}
                onFocus={() => this.showLocationPicker(location)}
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
        </ScrollView>
      </SafeAreaView>
    )
  }
}
