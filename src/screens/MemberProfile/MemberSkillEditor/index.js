import React from 'react'
import { ScrollView } from 'react-native'
import KeyboardFriendlyView from 'components/KeyboardFriendlyView'
import SkillEditor from 'components/SkillEditor'
import styles from './MemberSkillEditor.styles'

export default function MemberSkillEditor ({ navigation }) {    
  return (
    <KeyboardFriendlyView style={styles.container}>
      <ScrollView>
        <SkillEditor done={() => navigation.goBack()} doneLabel='Done' theme={styles.skillEditor} />
      </ScrollView>
    </KeyboardFriendlyView>
  )
}
