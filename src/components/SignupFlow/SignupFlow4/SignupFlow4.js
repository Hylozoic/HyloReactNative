import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SettingControl from '../../SettingControl'
import styles from './SignupFlow4.styles'
import { keyboardAvoidingViewProps as kavProps } from 'util/viewHelpers'
import { isEmpty } from 'lodash/fp'

export default class SignupFlow4 extends React.Component {
  static navigationOptions = () => ({
    headerTitle: 'STEP 4/5',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerTintColor: styles.headerTintColor,
    headerBackTitle: null
  })

  state = {
    showOther: true
  }

  componentDidMount () {
    this.props.loadSkills()
  }

  addSkill = skill => {
    this.props.addSkill(skill)
    this.setState({showOther: true})
  }

  removeSkill = skill => {
    this.props.removeSkill(skill)
    this.setState({showOther: true})
  }

  onPressOther = () => {
    this.setState({showOther: false})
    this.control && this.control.focus()
  }

  render () {
    const { saveAndNext, skill, setSkill, userSkills, remainingSkills } = this.props

    const editingSkill = !isEmpty(skill)
    const { showOther } = this.state

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <View style={styles.containerPadding}>
          <Text style={styles.title}>Share your unique super powers!</Text>
          <Text style={styles.subTitle}>
            What skills are you known for? The more skills you add, the more relevant the content. Its like magic.
          </Text>
        </View>
        <SettingControl
          ref={c => { this.control = c }}
          style={styles.containerPadding}
          label='How can you help?'
          value={skill}
          onChange={setSkill} />
        <SkillCloud skills={remainingSkills}
          onPress={this.addSkill}
          onPressOther={showOther && this.onPressOther} />
        {!isEmpty(userSkills) && <View style={styles.userSkills}>
          <Text style={styles.yourSkillsLabel}>Your Skills</Text>
          <SkillCloud skills={userSkills} onPress={this.removeSkill} />
        </View>}
        <Button
          style={styles.continueButton}
          text={editingSkill ? 'Add Skill' : 'Continue'}
          onPress={editingSkill ? () => this.addSkill(skill) : saveAndNext} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export function SkillCloud ({ skills, onPress, style, onPressOther }) {
  return <View style={[styles.skillCloud, style]}>
    {skills.map((skill, i) => <SkillPill skill={skill} onPress={onPress} key={i} />)}
    {!!onPressOther && <SkillPill skill='+ Other' onPress={onPressOther} />}
  </View>
}

export function SkillPill ({ skill, onPress }) {
  return <TouchableOpacity onPress={() => onPress(skill)} style={styles.skillPill}>
    <Text style={styles.skillText}>{skill.toUpperCase()}</Text>
  </TouchableOpacity>
}
