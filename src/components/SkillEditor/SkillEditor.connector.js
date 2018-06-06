import { connect } from 'react-redux'
import {
  setSkill, getSkill, getUserSkills, getMySkillsFromOrm, addSkill, removeSkill, setUserSkills
} from './SkillEditor.store.js'
import { isEmpty, includes } from 'lodash/fp'

const defaultSkills = [
  'Writing',
  'Design',
  'Project Management',
  'Photography',
  'Facilitation',
  'Media',
  'Community Organizing',
  'Technology',
  'Social Media',
  'Event Planning',
  'Education',
  'Communications'
]

export function remainingSkills (skillFilter, userSkills, allSkills = defaultSkills) {
  const unchosen = skill => !includes(skill, userSkills)

  const filter = isEmpty(skillFilter)
    ? unchosen
    : skill => unchosen(skill) && skill.startsWith(skillFilter)

  return allSkills.filter(filter)
}

export function mapStateToProps (state, props) {
  const skill = getSkill(state)
  const userSkills = getUserSkills(state)
  const storedSkills = getMySkillsFromOrm(state)
  return {
    skill,
    userSkills,
    remainingSkills: remainingSkills(skill, userSkills),
    storedSkills
  }
}

export const mapDispatchToProps = {
  setSkill, addSkill, removeSkill, setUserSkills
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const loadSkills = () => {
    dispatchProps.setUserSkills(stateProps.storedSkills.map(s => s.name))
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadSkills
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
