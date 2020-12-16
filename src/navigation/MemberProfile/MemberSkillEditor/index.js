import React from 'react'
import { ScrollView } from 'react-native'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import SkillEditor from 'components/SkillEditor'
import styles from './MemberSkillEditor.styles'

export default function MemberSkillEditor ({ navigation }) {    
  return (
    <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <SkillEditor done={() => navigation.goBack()} doneLabel='Done' theme={styles.skillEditor} />
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
