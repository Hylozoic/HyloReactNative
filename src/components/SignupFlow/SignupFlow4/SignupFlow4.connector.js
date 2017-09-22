import { connect } from 'react-redux'
import {
  setSkill, getSkill, getUserSkills, getSkillsFromOrm, addSkill, removeSkill, setUserSkills
} from '../SignupFlow.store.js'
import fetchCurrentUser from '../../../store/actions/fetchCurrentUser'
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
  const storedSkills = getSkillsFromOrm(state)
  return {
    skill,
    userSkills,
    remainingSkills: remainingSkills(skill, userSkills),
    storedSkills
  }
}

export const mapDispatchToProps = {
  setSkill, addSkill, removeSkill, fetchCurrentUser, setUserSkills
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow5')
  const saveAndNext = () => {
    goToNext()
  }

  const loadSkills = () => {
    dispatchProps.setUserSkills(stateProps.storedSkills.map(s => s.name))
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveAndNext,
    loadSkills
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
