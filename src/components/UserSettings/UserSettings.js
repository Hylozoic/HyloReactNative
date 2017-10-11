import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { validateUser } from 'hylo-utils/validators'
import validator from 'validator'
import KeyboardFriendlyView from '../KeyboardFriendlyView'
import Loading from '../Loading'
import Button from '../Button'
import SettingControl from '../SettingControl'
import styles from './UserSettings.styles'
import { any, values, isNil } from 'lodash/fp'

export default class Signup extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Account Info',
      headerStyle: styles.header,
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle
    }
  }

  state = {
    editingPassword: false,
    changed: false,
    edits: {
      email: ''
    },
    errors: {}
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setEditState()
    }
  }

  setEditState () {
    if (!this.props.currentUser) return
    const { email } = this.props.currentUser
    this.setState({
      edits: {
        email
      }
    })
  }

  editPassword = () => {
    this.setState({editingPassword: true})
  }

  cancelPassword = () => {
    this.setState({
      editingPassword: false,
      edits: {
        ...this.state.edits,
        password: null,
        confirmPassword: null
      },
      errors: {
        ...this.state.errors,
        password: null,
        confirmPassword: null
      }
    })
  }

  updateField = (key, value) => {
    this.setState({
      changed: true,
      edits: {
        ...this.state.edits,
        [key]: value
      },
      errors: {
        ...this.state.errors,
        [key]: null
      }
    })
  }

  validate () {
    const { email, password, confirmPassword } = this.state.edits
    const errors = {
      email: !validator.isEmail(email) && 'Must be a valid email',
      password: !isNil(password) && validateUser.password(password),
      confirmPassword: password !== confirmPassword && 'Passwords must match'
    }
    this.setState({errors})
    return !any(i => i, values(errors))
  }

  saveChanges = () => {
    if (this.validate()) {
      const { email, password } = this.state.edits
      const settings = {email}
      if (!isNil(password)) settings.password = password
      this.setState({
        changed: false,
        editingPassword: false
      })
      this.props.updateUserSettings(settings)
    }
  }

  confirmLeave = (onLeave) => {
    if (this.state.changed) {
      Alert.alert(
        'You have unsaved changes',
        'Are you sure you want to leave?',
        [
          {text: 'Leave', onPress: onLeave},
          {text: 'Cancel', style: 'cancel'}
        ])
    } else {
      onLeave()
    }
  }

  cancel = () => {
    this.confirmLeave(this.props.cancel)
  }

  logout = () => {
    this.confirmLeave(this.props.logout)
  }

  render () {
    const { currentUser, facebookUrl, twitterName } = this.props
    const { editingPassword, edits: { email, password, confirmPassword }, errors, changed } = this.state
    if (!currentUser) return <Loading />
    return <KeyboardFriendlyView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <SettingControl
          label='EMAIL'
          value={email}
          keyboardType={'email-address'}
          autoCapitalize='none'
          autoCorrect={false}
          onChange={value => this.updateField('email', value)}
          error={errors.email}
          theme={styles.settingControl} />
        {!editingPassword && <View style={styles.setting}>
          <Text style={styles.settingLabel}>PASSWORD</Text>
          <TouchableOpacity onPress={this.editPassword}>
            <Text style={styles.linkText}>Change Password</Text>
          </TouchableOpacity>
        </View>}
        {editingPassword && <SettingControl
          label='PASSWORD'
          value={password}
          toggleSecureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          onChange={value => this.updateField('password', value)}
          error={errors.password}
          theme={styles.settingControl} />}
        {editingPassword && <SettingControl
          label='CONFIRM PASSWORD'
          value={confirmPassword}
          toggleSecureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          onChange={value => this.updateField('confirmPassword', value)}
          error={errors.confirmPassword}
          theme={styles.settingControl} />}
        {editingPassword && <TouchableOpacity style={styles.cancelPassword} onPress={this.cancelPassword}>
          <Text style={styles.linkText}>Cancel Password Change</Text>
        </TouchableOpacity>}
        <SocialAccounts
          facebookUrl={facebookUrl}
          twitterName={twitterName} />
        <Footer saveChanges={changed && this.saveChanges} cancel={this.cancel} logout={this.logout} />
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
        <Text style={styles.linkText}>{linked ? 'Unlink' : 'Link'}</Text>
      </TouchableOpacity>
    </View>
  }
}

export function Footer ({ saveChanges, cancel, logout }) {
  return <View style={styles.footer}>
    <Button text='Save Changes' onPress={saveChanges} style={styles.save} disabled={!saveChanges} />
    <TouchableOpacity onPress={cancel}>
      <Text style={styles.cancel}>Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={logout}>
      <Text style={styles.cancel}>Logout</Text>
    </TouchableOpacity>
  </View>
}
