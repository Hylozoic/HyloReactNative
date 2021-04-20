import React from 'react'
import { ScrollView } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SkillEditor from 'components/SkillEditor'
import styles from './SignupFlow4.styles'
import SafeAreaView from 'react-native-safe-area-view'

export default function SignupFlow4 ({ goToNext }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <KeyboardFriendlyView>
          <SkillEditor done={goToNext} doneLabel='Continue' theme={styles.skillEditor} />
        </KeyboardFriendlyView>
      </ScrollView>
    </SafeAreaView>
  )
}
