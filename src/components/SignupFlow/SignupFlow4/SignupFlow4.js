import React from 'react'
import {
  ScrollView
} from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SkillEditor from '../../SkillEditor'
import styles from './SignupFlow4.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'

export default class SignupFlow4 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 4/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    headerBackTitle: null
  })

  render () {
    const { goToNext } = this.props

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <SkillEditor done={goToNext} doneLabel='Continue' />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}
