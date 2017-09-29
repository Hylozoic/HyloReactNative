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
import { isEmpty } from 'lodash/fp'

export default class SignupFlow5 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 5/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor
  })

  render () {
    const { name, email, password, location, avatarUrl, skills, finishSignup, makeChanges } = this.props

    return <View style={styles.container}>
      <Text style={styles.title}>Everything looking good?</Text>
      <Text style={styles.subTitle}>
        You can always come back and change your details at any time.
      </Text>
      {!isEmpty(avatarUrl) && <View style={styles.imageWrapper}>
        <Image style={styles.image} source={{uri: avatarUrl}} />
      </View>}
      <SignupControl
        label='Your Full Name'
        value={name} />
      <SignupControl
        label='Email Address'
        value={email}
        keyboardType={'email-address'}
        autoCapitalize='none'
        autoCorrect={false} />
      {!isEmpty(password) && <SignupControl
        label='Password'
        value={password}
        togglableSecureTextEntry />}
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
          onPress={finishSignup} />
      </View>
    </View>
  }
}
