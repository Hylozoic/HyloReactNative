import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { get, any, values, isNil } from 'lodash/fp'
import validator from 'validator'
import prompt from 'react-native-prompt-android'
import { validateUser } from 'hylo-utils/validators'
import { showToast } from 'util/toast'
import confirmDiscardChanges from 'util/confirmDiscardChanges'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import { permissions } from 'screens/Login/FbLoginButton'
import Loading from 'components/Loading'
import Button from 'components/Button'
import SettingControl from 'components/SettingControl'
import styles from './UserSettings.styles'

export default class UserSettings extends React.Component {  
  passwordInputRef = React.createRef()
  
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
    const { resettingPassword } = this.props
    const { email, facebookUrl, twitterName } = this.props.currentUser

    resettingPassword && this.editPassword()
    this.setState({
      edits: {
        email,
        facebookUrl,
        twitterName
      }
    })
  }

  editPassword = () => {
    // TODO: Currently not setting focus perhaps because it needs to happen
    // after field is shown?
    // this.passwordInputRef()
    this.setState({ editingPassword: true })
  }

  cancelPassword = () => {
    const changed = this.state.edits.email !== this.props.currentUser.email
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
      },
      changed
    })
  }

  updateField = (key, value, setChanged = true) => {
    const { changed, edits, errors } = this.state
    this.setState({
      changed: setChanged ? true : changed,
      edits: {
        ...edits,
        [key]: value
      },
      errors: {
        ...errors,
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
    this.setState({ errors })
    return !any(i => i, values(errors))
  }

  saveChanges = () => {
    if (this.validate()) {
      const { email, password } = this.state.edits
      const settings = { email }
      if (!isNil(password)) settings.password = password
      this.setState({
        changed: false,
        editingPassword: false
      })
      return this.props.updateUserSettings(settings)
        .then(({ error }) => {
          if (error) {
            showToast('Error saving password. Try again later.')
          } else {
            showToast('Password Updated')
          }
        })
    }
  }

  confirmLeave = (onLeave) => {
    confirmDiscardChanges({
      hasChanges: this.state.changed,
      onDiscard: onLeave
    })
  }

  cancel = () => {
    this.confirmLeave(this.props.cancel)
  }

  logout = () => {
    this.confirmLeave(this.props.logout)
  }

  twitterPrompt = onPress => {
    prompt(
      'Enter Twitter Name',
      'Please enter your twitter name to link your account.',
      [
        { text: 'Cancel', onPress: () => onPress(false), style: 'cancel' },
        { text: 'OK', onPress: twitterName => onPress(twitterName) }
      ],
      {
        cancelable: false
      })
  }

  loginWithFacebook = onLogin => {
    const { loginWithFacebook } = this.props
    return LoginManager.logInWithReadPermissions(permissions)
      .then(result => {
        if (result.isCancelled) return onLogin(false)
        return AccessToken.getCurrentAccessToken()
          .then(data => loginWithFacebook(data.accessToken.toString()))
          .then(() => onLogin(true))
      })
      .catch(() => {
        onLogin(false)
      })
  }

  render () {
    const { currentUser, updateUserSettings, unlinkAccount, goToNotificationSettings, goToBlockedUsers } = this.props
    const { editingPassword, edits: { email, password, confirmPassword, facebookUrl, twitterName }, errors, changed } = this.state
    if (!currentUser) return <Loading />
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardFriendlyView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <SettingControl
              label='EMAIL'
              value={email}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              onChange={value => this.updateField('email', value)}
              error={errors.email}
              theme={styles.settingControl}
            />
            {!editingPassword && (
              <View style={styles.setting}>
                <Text style={styles.settingLabel}>PASSWORD</Text>
                <TouchableOpacity onPress={this.editPassword}>
                  <Text style={styles.linkText} ref={this.passwordInputRef}>Change Password</Text>
                </TouchableOpacity>
              </View>
            )}
            {editingPassword && (
              <SettingControl
                label='PASSWORD'
                value={password}
                toggleSecureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
                onChange={value => this.updateField('password', value)}
                error={errors.password}
                theme={styles.settingControl}
              />
            )}
            {editingPassword && (
              <SettingControl
                label='CONFIRM PASSWORD'
                value={confirmPassword}
                toggleSecureTextEntry
                autoCapitalize='none'
                autoCorrect={false}
                onChange={value => this.updateField('confirmPassword', value)}
                error={errors.confirmPassword}
                theme={styles.settingControl}
              />
            )}
            {editingPassword && (
              <TouchableOpacity style={styles.cancelPassword} onPress={this.cancelPassword}>
                <Text style={styles.linkText}>Cancel Password Change</Text>
              </TouchableOpacity>
            )}
            <SocialAccounts
              facebookUrl={facebookUrl}
              twitterName={twitterName}
              twitterPrompt={this.twitterPrompt}
              loginWithFacebook={this.loginWithFacebook}
              updateUserSettings={updateUserSettings}
              updateField={this.updateField}
              unlinkAccount={unlinkAccount}
            />
            <View style={styles.blockedUsersWrapper}>
              <Button text='Blocked Users' onPress={goToBlockedUsers} style={styles.blockedUsers} />
            </View>
            <View style={styles.notificationSettingsWrapper}>
              <Button text='Notification Settings' onPress={goToNotificationSettings} style={styles.notificationSettings} />
            </View>
            <Footer saveChanges={changed && this.saveChanges} cancel={this.cancel} logout={this.logout} />
          </ScrollView>
        </KeyboardFriendlyView>
      </SafeAreaView>
    )
  }
}

export function SocialAccounts ({
  twitterPrompt, facebookUrl, twitterName, loginWithFacebook, updateUserSettings, unlinkAccount, updateField
}) {
  return (
    <View style={styles.socialAccounts}>
      <Text style={[styles.settingLabel, styles.socialAccountsLabel]}>SOCIAL ACCOUNTS</Text>
      <SocialControl
        label='Facebook'
        onLink={loginWithFacebook}
        onChange={value => updateField('facebookUrl', value, false)}
        unlinkAccount={unlinkAccount}
        provider='facebook'
        value={facebookUrl}
      />
      <SocialControl
        label='Twitter'
        onLink={twitterPrompt}
        onChange={value => updateField('twitterName', value, false)}
        unlinkAccount={unlinkAccount}
        provider='twitter'
        value={twitterName}
        updateUserSettings={updateUserSettings}
      />
    </View>
  )
}

export class SocialControl extends React.Component {
  state = {
    loading: false
  }

  linkClicked () {
    const { provider, onLink, updateUserSettings, onChange } = this.props

    if (provider === 'twitter') {
      onLink(twitterName => {
        if (!twitterName) return onChange(false)
        updateUserSettings({ twitterName })
        return onChange(true)
      })
    } else {
      this.setState({ loading: true })
      return onLink(onChange)
        .then(() => this.setState({ loading: false }))
    }
  }

  unlinkClicked () {
    const { provider, unlinkAccount, onChange } = this.props
    unlinkAccount(provider)
    return onChange(false)
  }

  render () {
    const { label, value = '' } = this.props
    const { loading } = this.state
    const linked = !!value

    return (
      <View style={[styles.socialControl, linked && styles.linked]}>
        <Text style={styles.settingText}>{label}</Text>
        {loading && <Text style={styles.loadingText}>Loading</Text>}
        {!loading && (
          <TouchableOpacity onPress={linked ? () => this.unlinkClicked() : () => this.linkClicked()}>
            <Text style={styles.linkText}>{linked ? 'Unlink' : 'Link'}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

export function Footer ({ saveChanges, cancel, logout }) {
  return (
    <View style={styles.footer}>
      <Button text='Save Changes' onPress={saveChanges} style={styles.save} disabled={!saveChanges} />
      <TouchableOpacity onPress={cancel}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
      <Button text='Logout' onPress={logout} style={styles.logoutButton} />
    </View>
  )
}
