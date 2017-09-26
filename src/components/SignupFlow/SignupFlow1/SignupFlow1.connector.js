import { connect } from 'react-redux'
import { signup, getUserSettings, updateUserSettings, updateLocalUserSettings } from '../SignupFlow.store.js'
import getMe from '../../../store/selectors/getMe'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const { name, email, password } = getUserSettings(state)
  return {
    name,
    email,
    password,
    currentUser
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    signup: params => dispatch(signup(params)),
    changeSetting: setting => value => dispatch(updateLocalUserSettings({[setting]: value})),
    updateUserSettings: settings => dispatch(updateUserSettings(settings))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow2')
  const { name, email, password, currentUser } = stateProps
  const { signup, updateUserSettings } = dispatchProps
  const saveFunc = currentUser ? updateUserSettings : signup
  const signupOrUpdate = () => saveFunc({name, email, password})
  .then(({ error }) => {
    if (error) return
    return goToNext()
  })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    signupOrUpdate
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
