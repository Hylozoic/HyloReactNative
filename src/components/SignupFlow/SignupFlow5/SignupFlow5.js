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
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SignupControl from '../SignupControl'
import Button from '../../Button'
import styles from './SignupFlow5.styles'
import { SkillCloud } from '../SignupFlow4/SignupFlow4'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { isEmpty, flow, values, filter, map } from 'lodash/fp'

export default class SignupFlow5 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 5/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    headerBackTitle: null
  })

  state = {
    errors: {}
  }

  controls = {}

  updateField (key, value) {
    this.setError(key, null)
    this.props.updateLocalSetting(key, value)
  }

  updateSetting (key, value, fieldKey) {
    if (this.validate(key)) {
      this.props.updateSetting(key, value)
    } else {
      setTimeout(() => this.controls[fieldKey || key].makeEditable(), 50)
    }
  }

  validate (key) {
    const {
      name, email, password, confirmPassword, showPasswordField
    } = this.props
    var error, passwordError, confirmError
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

  finishSignup () {
    const { finishSignup } = this.props
    const unsavedControls = flow(values,
      filter(c => c.isEditable()),
      map(c => c.highlightCheck()))(this.controls)
    if (unsavedControls.length === 0) finishSignup()
  }

  render () {
    const {
      name, email, password, confirmPassword, location, avatarUrl, skills,
      makeChanges, showPasswordField, goToImage, goToSkills
    } = this.props
    const { errors } = this.state
    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <Text style={styles.title}>Everything looking good?</Text>
        <Text style={styles.subTitle}>
          You can always come back and change your details at any time.
        </Text>
        {!isEmpty(avatarUrl) && <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={goToImage}>
            <Image style={styles.image} source={{uri: avatarUrl}} />
          </TouchableOpacity>
        </View>}
        <SignupControl
          ref={c => { this.controls.name = c }}
          label='Your Full Name'
          value={name}
          toggleEditable
          error={errors.name}
          onChange={value => this.updateField('name', value)}
          onSubmitEditing={() => this.updateSetting('name', name)} />
        <SignupControl
          ref={c => { this.controls.email = c }}
          label='Email Address'
          value={email}
          keyboardType={'email-address'}
          autoCapitalize='none'
          autoCorrect={false}
          toggleEditable
          error={errors.email}
          onChange={value => this.updateField('email', value)}
          onSubmitEditing={() => this.updateSetting('email', email)} />
        {showPasswordField && <SignupControl
          ref={c => { this.controls.password = c }}
          label='Password'
          value={password}
          toggleSecureTextEntry
          toggleEditable
          error={errors.password}
          onChange={value => this.updateField('password', value)}
          onSubmitEditing={() => this.updateSetting('password', password)} />}
        {showPasswordField && <SignupControl
          ref={c => { this.controls.confirmPassword = c }}
          label='Confirm Password'
          value={confirmPassword}
          toggleSecureTextEntry
          toggleEditable
          error={errors.confirmPassword}
          onChange={value => this.updateField('confirmPassword', value)}
          onSubmitEditing={() => this.updateSetting('password', password, 'confirmPassword')} />}
        <SignupControl
          ref={c => { this.controls.location = c }}
          label='Location'
          value={location}
          toggleEditable
          onChange={value => this.updateField('location', value)}
          onSubmitEditing={() => this.updateSetting('location', location)} />
        <TouchableOpacity onPress={goToSkills}>
          <Text style={styles.skillsLabel}>Skills</Text>
          <SkillCloud skills={skills} style={styles.skillCloud} onPress={goToSkills} />
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <Button
            style={styles.changesButton}
            text='Make Changes'
            onPress={makeChanges} />
          <Button
            style={styles.continueButton}
            text='Finish'
            onPress={() => this.finishSignup()} />
        </View>
      </ScrollView>
    </KeyboardFriendlyView>
  }
}
