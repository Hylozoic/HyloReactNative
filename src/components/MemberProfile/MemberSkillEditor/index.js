import React from 'react'
import {
  ScrollView
} from 'react-native'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SkillEditor from '../../SkillEditor'
import styles from './MemberSkillEditor.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import header from 'util/header'
import { get } from 'lodash/fp'

export default class SignupFlow4 extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return header(navigation, {
      title: 'Edit Skills'
    })
  }

  render () {
    const id = get('navigation.state.params.id', this.props)
    const goBack = () => {
      console.log('goin back')
      this.props.navigation.goBack()
      // this.props.navigation.navigate('MemberDetails', {id})
    }

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <SkillEditor done={goBack} doneLabel='Done' theme={styles.skillEditor} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}
