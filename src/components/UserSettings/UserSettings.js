import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Loading from '../Loading'
import Button from '../Button'
import styles from './UserSettings.styles'

export default class Signup extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Account Info',
      headerStyle: styles.header,
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle
    }
  }
  render () {
    const { currentUser, saveChanges, cancel, facebookUrl, twitterName } = this.props
    if (!currentUser) return <Loading />
    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>EMAIL</Text>
          <Text style={styles.settingText}>{currentUser.email}</Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>PASSWORD</Text>
          <Text style={styles.settingText}>{currentUser.email}</Text>
        </View>
        <SocialAccounts
          facebookUrl={facebookUrl}
          twitterName={twitterName} />
        <Footer saveChanges={saveChanges} cancel={cancel} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export function SocialAccounts ({
  loginWithService, twitterPrompt, facebookUrl, twitterName, updateUserSettings, unlinkAccount
}) {
  return <View style={styles.socialAccounts}>
    <Text style={[styles.settingLabel, styles.socialAccountsLabel]}>SOCIAL ACCOUNTS</Text>
    <SocialControl
      label='Facebook'
      onLink={() => loginWithService('facebook')}
      onChange={value => updateUserSettings({facebookUrl: value})}
      unlinkAccount={unlinkAccount}
      provider='facebook'
      value={facebookUrl} />
    <SocialControl
      label='Twitter'
      onLink={() => twitterPrompt()}
      onChange={value => updateUserSettings({twitterName: value})}
      unlinkAccount={unlinkAccount}
      provider='twitter'
      value={twitterName}
      updateUserSettings={updateUserSettings} />
  </View>
}

export class SocialControl extends React.Component {
  linkClicked () {
    const { provider, onLink, updateUserSettings, onChange } = this.props

    if (provider === 'twitter') {
      const twitterName = onLink()
      if (twitterName === null) return onChange(false)
      updateUserSettings({twitterName})
      return onChange(true)
    } else {
      return onLink()
      .then(({ error }) => {
        if (error) return onChange(false)
        return onChange(true)
      })
    }
  }

  unlinkClicked () {
    const { provider, unlinkAccount, onChange } = this.props
    unlinkAccount(provider)
    return onChange(false)
  }

  render () {
    const { label, value = '' } = this.props
    const linked = !!value

    return <View style={[styles.socialControl, linked && styles.linked]}>
      <Text style={styles.settingText}>{label}</Text>
      <TouchableOpacity onPress={linked ? () => this.unlinkClicked() : () => this.linkClicked()}>
        <Text style={styles.socialLink}>{linked ? 'Unlink' : 'Link'}</Text>
      </TouchableOpacity>
    </View>
  }
}

export function Footer ({ saveChanges, cancel }) {
  return <View style={styles.footer}>
    <Button text='Save Changes' onPress={saveChanges} style={styles.save} />
    <TouchableOpacity onPress={cancel}>
      <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
  </View>
}
