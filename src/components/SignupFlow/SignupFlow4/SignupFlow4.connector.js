import { connect } from 'react-redux'
import {
  setSkill, getSkill, getUserSkills, addUserSkill, removeUserSkill
} from '../SignupFlow.store.js'
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
  return {
    skill,
    userSkills,
    remainingSkills: remainingSkills(skill, userSkills)
  }
}

export const mapDispatchToProps = {
  setSkill, addUserSkill, removeUserSkill
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow5')
  const saveAndNext = () => {
    goToNext()
    console.log('something good happens here')
  }

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    saveAndNext
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
