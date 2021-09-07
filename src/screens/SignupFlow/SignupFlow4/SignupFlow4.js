import React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { validateUser } from 'hylo-utils/validators'
import validator from 'validator'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SettingControl from 'components/SettingControl'
import Button from 'components/Button'
import styles from './SignupFlow4.styles'
// import { SkillCloud } from 'components/SkillEditor/SkillEditor'
import { isEmpty, flow, values, filter, map } from 'lodash/fp'

export default class SignupFlow4 extends React.Component {
  state = {
    errors: {}
  }

  controlRefs = {
    name: React.createRef(),
    email: React.createRef(),
    password: React.createRef(),
    confirmPassword: React.createRef()
  }

  updateField (key, value) {
    this.setError(key, null)
    this.props.updateLocalSetting(key, value)
  }

  updateSetting (key, value, fieldKey) {
    if (this.validate(key)) {
      this.props.updateSetting(key, value)
    } else {
      setTimeout(() => this.controlRefs[fieldKey || key].current.makeEditable(), 50)
    }
  }

  validate (key) {
    const {
      name, email, password, confirmPassword, showPasswordField
    } = this.props
    let error, passwordError, confirmError
    switch (key) {
      case 'name':
        error = validateUser.name(name)
        this.setError('name', error)
        return !error
      case 'email':
        error = !validator.isEmail(email) && 'Must be a valid email'
        this.setError('email', error)
        return !error
      case 'password':
        passwordError = showPasswordField && validateUser.password(password)
        confirmError = showPasswordField && password !== confirmPassword && 'Passwords must match'
        this.setError('password', passwordError)
        this.setError('confirmPassword', confirmError)
        return !(passwordError || confirmError)
      default:
        return true
    }
  }

  setError (key, value) {
    this.setState({
      errors: {
        ...this.state.errors,
        [key]: value
      }
    })
  }

  finishSignup = () => {
    const { finishSignup } = this.props
    const unsavedControls = flow(values,
      filter(c => c.current?.isEditable()),
      map(c => c.current.highlightCheck()))(this.controlRefs)
    if (unsavedControls.length === 0) finishSignup()
  }

  render () {
    const {
      name, email, password, confirmPassword, location, avatarUrl, skills,
      makeChanges, showPasswordField, goToImage
    } = this.props
    const { errors } = this.state

    return (
      <KeyboardFriendlyView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Everything looking good?</Text>
          <Text style={styles.subTitle}>
            You can always come back and change your details at any time.
          </Text>
          {!isEmpty(avatarUrl) && <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={goToImage}>
              <Image style={styles.image} source={{ uri: avatarUrl }} />
            </TouchableOpacity>
          </View>}
          <SettingControl
            ref={this.controlRefs.name}
            label='Your Full Name'
            value={name}
            toggleEditable
            error={errors.name}
            onChange={value => this.updateField('name', value)}
            onSubmitEditing={() => this.updateSetting('name', name)}
          />
          <SettingControl
            ref={c => { this.controlRefs.email = c }}
            label='Email Address'
            value={email}
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            toggleEditable
            error={errors.email}
            onChange={value => this.updateField('email', value)}
            onSubmitEditing={() => this.updateSetting('email', email)}
          />
          {showPasswordField && <SettingControl
            ref={this.controlRefs.password}
            label='Password'
            value={password}
            toggleSecureTextEntry
            toggleEditable
            error={errors.password}
            onChange={value => this.updateField('password', value)}
            onSubmitEditing={() => this.updateSetting('password', password)}
                                />}
          {showPasswordField && <SettingControl
            ref={this.controlRefs.confirmPassword}
            label='Confirm Password'
            value={confirmPassword}
            toggleSecureTextEntry
            toggleEditable
            error={errors.confirmPassword}
            onChange={value => this.updateField('confirmPassword', value)}
            onSubmitEditing={() => this.updateSetting('password', password, 'confirmPassword')}
                                />}
          <SettingControl
            ref={this.controlRefs.location}
            label='Location'
            value={location}
            toggleEditable
            onChange={value => this.updateField('location', value)}
            onSubmitEditing={() => this.updateSetting('location', location)}
          />
          <View style={styles.buttonRow}>
            <Button
              style={styles.changesButton}
              text='Make Changes'
              onPress={makeChanges}
            />
            <Button
              style={styles.continueButton}
              text='Finish'
              onPress={this.finishSignup}
            />
          </View>
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}
