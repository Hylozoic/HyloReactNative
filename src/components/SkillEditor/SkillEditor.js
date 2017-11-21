import React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import SettingControl from '../SettingControl'
import Button from '../Button'
import styles from './SkillEditor.styles'
import { isEmpty } from 'lodash/fp'

export default class SkillEditor extends React.Component {
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
    const { skill, setSkill, userSkills, remainingSkills, done, doneLabel, theme = {} } = this.props

    const editingSkill = !isEmpty(skill)
    const showOther = this.state.showOther && !editingSkill

    return <View>
      <View style={styles.containerPadding}>
        <Text style={[styles.title, theme.title]}>Share your unique super powers!</Text>
        <Text style={[styles.subTitle, theme.subTitle]}>
          What skills are you known for? The more skills you add, the more relevant the content. Its like magic.
        </Text>
      </View>
      {!isEmpty(userSkills) && <View style={[styles.userSkills, theme.userSkills]}>
        <Text style={[styles.yourSkillsLabel, theme.yourSkillsLabel]}>Your Skills</Text>
        <SkillCloud skills={userSkills} onPress={this.removeSkill} theme={theme} />
      </View>}
      <SettingControl
        ref={c => { this.control = c }}
        style={styles.skillControl}
        theme={theme.skillControl}
        label='How can you help?'
        value={skill}
        onChange={setSkill} />
      <SkillCloud skills={remainingSkills}
        onPress={this.addSkill}
        onPressOther={showOther && this.onPressOther}
        style={styles.remainingSkills}
        theme={theme} />
      <Button
        style={{...styles.continueButton, ...theme.continueButton}}
        text={editingSkill ? 'Add Skill' : doneLabel}
        onPress={editingSkill ? () => this.addSkill(skill) : done} />
    </View>
  }
}

export function SkillCloud ({ skills, onPress, style, onPressOther, theme = {} }) {
  return <View style={[styles.skillCloud, theme.skillCloud, style]}>
    {skills.map((skill, i) => <SkillPill skill={skill} onPress={onPress} key={i} theme={theme} />)}
    {!!onPressOther && <SkillPill skill='+ Other' onPress={onPressOther} theme={theme} />}
  </View>
}

export function SkillPill ({ skill, onPress, theme }) {
  return <TouchableOpacity onPress={() => onPress(skill)} style={[styles.skillPill, theme.skillPill]}>
    <Text style={[styles.skillText, theme.skillText]}>{skill.toUpperCase()}</Text>
  </TouchableOpacity>
}
