import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Button from '../../Button'
import KeyboardFriendlyView from '../../KeyboardFriendlyView'
import SignupControl from '../SignupControl'
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

  componentDidMount () {
    this.props.loadSkills()
  }

  render () {
    const { saveAndNext, skill, setSkill, userSkills, remainingSkills, addSkill, removeSkill } = this.props

    const editingSkill = !isEmpty(skill)

    return <KeyboardFriendlyView style={styles.container} {...kavProps}>
      <ScrollView>
        <View style={styles.containerPadding}>
          <Text style={styles.title}>Share your unique super powers!</Text>
          <Text style={styles.subTitle}>
            What skills are you known for? The more skills you add, the more relevant the content. Its like magic.
          </Text>
        </View>
        <SignupControl
          style={styles.containerPadding}
          label='How can you help?'
          value={skill}
          onChange={setSkill} />
        <SkillCloud skills={remainingSkills} onPress={addSkill} />
        {!isEmpty(userSkills) && <View style={styles.userSkills}>
          <Text style={styles.yourSkillsLabel}>Your Skills</Text>
          <SkillCloud skills={userSkills} onPress={removeSkill} />
        </View>}
        <Button
          style={styles.continueButton}
          text={editingSkill ? 'Add Skill' : 'Continue'}
          onPress={editingSkill ? () => addSkill(skill) : saveAndNext} />
      </ScrollView>
    </KeyboardFriendlyView>
  }
}

export function SkillCloud ({ skills, onPress, style }) {
  return <View style={[styles.skillCloud, style]}>
    {skills.map((skill, i) => <SkillPill skill={skill} onPress={onPress} key={i} />)}
  </View>
}

export function SkillPill ({ skill, onPress }) {
  return <TouchableOpacity onPress={() => onPress(skill)} style={styles.skillPill}>
    <Text style={styles.skillText}>{skill.toUpperCase()}</Text>
  </TouchableOpacity>
}
