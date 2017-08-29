import { connect } from 'react-redux'
import { signup, getUserSettings, updateUserSettings } from '../SignupFlow.store.js'

export function mapStateToProps (state, props) {
  const { name, email, password } = getUserSettings(state)
  return {
    name,
    email,
    password
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    signup: params => dispatch(signup(params)),
    changeSetting: setting => value => dispatch(updateUserSettings({[setting]: value}))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToNext = () => ownProps.navigation.navigate('SignupFlow2')
  const { name, email, password } = stateProps
  const signup = () => dispatchProps.signup({name, email, password})
  .then(({ error }) => {
    if (error) return
    return goToNext()
  })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    signup
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
