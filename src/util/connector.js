/**
 * @providesModule util/connector
 */

export const mapWhenFocused = mapper => (state, props) => props.isFocused
  ? mapper(state, props)
  : props

export const mergeWhenFocused = merger => (stateProps, dispatchProps, ownProps) =>
  ownProps.isFocused ? merger(stateProps, dispatchProps, ownProps) : ownProps
