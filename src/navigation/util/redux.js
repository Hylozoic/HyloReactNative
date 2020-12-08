// Selectively call either `mapStateToProps` or `mapDispatchToProps` if
// `isFocused` is set. This allows us to avoid potentially expensive selector
// calls and other preprocessing tasks for screens that are currently
// backgrounded in createStackNavigator/createBottomTabNavigator.  Note that this will not always
// be necessary, and shouldn't be used by default. Sometimes it's going to be
// faster (particularly in the case of mapDispatchToProps) to just call the
// connector function without wrapping it.
//
// Use:
//
//   import { mapWhenFocused } from 'navigation/util/redux'
//
//   // ...
//
//   export default connect(
//     mapWhenFocused(mapStateToProps),
//     mapWhenFocused(mapDispatchToProps)
//   )
//
// Note that the component's own props will always be returned, so as not to
// break rendering of any child components.
export const mapWhenFocused = mapper => (stateOrDispatch, props) => props.isFocused
  ? mapper(stateOrDispatch, props)
  : props

// As above, but convenience function for `mergeProps`. Arguably we could just
// use one function, but naming would get a little murky.
export const mergeWhenFocused = merger => (stateProps, dispatchProps, ownProps) =>
  ownProps.isFocused ? merger(stateProps, dispatchProps, ownProps) : ownProps
