import React from 'react'
import {
  ScrollView
} from 'react-native'
import KeyboardFriendlyView from 'navigation/KeyboardFriendlyView'
import SkillEditor from 'components/SkillEditor'
import styles from './MemberSkillEditor.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import header from 'navigation/header'

export default class MemberSkillEditor extends React.Component {
  goBack = () => {
    this.props.navigation.goBack()
  }

  render () {
    return (
      <KeyboardFriendlyView style={styles.container} {...kavProps}>
        <ScrollView>
          <SkillEditor done={this.goBack} doneLabel='Done' theme={styles.skillEditor} />
        </ScrollView>
      </KeyboardFriendlyView>
    )
  }
}
