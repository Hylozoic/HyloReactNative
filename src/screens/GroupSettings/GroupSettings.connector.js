import { connect } from 'react-redux'
import getCurrentGroupId from 'store/selectors/getCurrentGroupId'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import { fetchGroupSettings, updateGroupSettings, UPDATE_GROUP_SETTINGS } from './GroupSettings.store'

export function mapStateToProps (state, props) {
  const groupId = getCurrentGroupId(state, props)
  const group = getCurrentGroup(state, props)
  const pendingSave = !!state.pending[UPDATE_GROUP_SETTINGS]
  return {
    groupId,
    group,
    pendingSave
  }
}

export const mapDispatchToProps = {
  fetchGroupSettings,
  updateGroupSettings
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { groupId } = stateProps

  const fetchGroupSettings = () =>
    dispatchProps.fetchGroupSettings(groupId)

  const updateGroupSettings = changes =>
    dispatchProps.updateGroupSettings(groupId, changes)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchGroupSettings,
    updateGroupSettings
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
