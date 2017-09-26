import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import SignupControl from '../SignupControl'
import Button from '../../Button'
import styles from './SignupFlow5.styles'
import { SkillCloud } from '../SignupFlow4/SignupFlow4'

export default class SignupFlow5 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 5/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor
  })

  componentDidMount () {
    const { fetchCurrentUser, loadUserSettings } = this.props
    fetchCurrentUser()
    .then(() => loadUserSettings())
  }

  componentDidUpdate (prevProps) {
    if (this.props.currentUser !== prevProps.currentUser) {
      this.props.loadUserSettings()
    }
  }

  render () {
    const { name, email, password, location, avatarUrl, skills, login, makeChanges } = this.props

    return <View style={styles.container}>
      <Text style={styles.title}>Everything looking fine and dandy?</Text>
      <Text style={styles.subTitle}>
        You can always come back and change your details at any time.
      </Text>
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={{uri: avatarUrl}} />
      </View>
      <SignupControl
        label='Your Full Name'
        value={name} />
      <SignupControl
        label='Email Address'
        value={email}
        keyboardType={'email-address'}
        autoCapitalize='none'
        autoCorrect={false} />
      <SignupControl
        label='Password'
        value={password}
        togglableSecureTextEntry />
      <SignupControl
        label='Location'
        value={location} />
      <View>
        <Text style={styles.skillsLabel}>Skills</Text>
        <SkillCloud skills={skills} style={styles.skillCloud} />
      </View>
      <View style={styles.buttonRow}>
        <Button
          style={styles.changesButton}
          text='Make Changes'
          onPress={makeChanges} />
        <Button
          style={styles.continueButton}
          text='Finish'
          onPress={login} />
      </View>
    </View>
  }
}
