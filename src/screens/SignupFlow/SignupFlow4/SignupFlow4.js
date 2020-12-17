import React from 'react'
import { ScrollView } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SkillEditor from 'components/SkillEditor'
import styles from './SignupFlow4.styles'

export default function SignupFlow4 ({ goToNext }) {
  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView>
        <SkillEditor done={goToNext} doneLabel='Continue' theme={styles.skillEditor} />
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
