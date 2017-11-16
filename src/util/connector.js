/**
 * @providesModule util/connector
 */

export const mapWhenFocused = mapper => (stateOrDispatch, props) => props.isFocused
  ? mapper(stateOrDispatch, props)
  : props

export const mergeWhenFocused = merger => (stateProps, dispatchProps, ownProps) =>
  ownProps.isFocused ? merger(stateProps, dispatchProps, ownProps) : ownProps
