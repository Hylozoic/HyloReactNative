import React from 'react'
import {
  ScrollView
} from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SkillEditor from '../../SkillEditor'
import styles from './MemberSkillEditor.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import header from 'util/header'

export default class SignupFlow4 extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Edit Skills'
    })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render () {
    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <SkillEditor done={this.goBack} doneLabel='Done' theme={styles.skillEditor} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}
