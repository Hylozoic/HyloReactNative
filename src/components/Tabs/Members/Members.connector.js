import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import { uniqueId } from 'lodash'
import { FETCH_MEMBERS, getHasMoreMembers, fetchMembers, getSort, setSort, getSearch, setSearch, getMembers } from './Members.store'
import getCommunity from '../../../store/selectors/getCommunity'

function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communityId = state.currentCommunity ||
    (currentUser && currentUser.lastViewedCommunity().id)
  const community = getCommunity(state, {id: communityId})
  const slug = community && community.slug

  const search = getSearch(state)
  const sortBy = getSort(state)
  const subject = 'community'  // TODO make this work with Networks

  return {
    currentUser,
    communityId,
    community,
    slug,
    search,
    sortBy,
    subject,
    members: getMembers(state, {subject, slug, search, sortBy}),
    hasMore: getHasMoreMembers(state, {subject, slug, search, sortBy}),
    pending: state.pending[FETCH_MEMBERS]
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    setSort: sort => dispatch(setSort(sort)),
    setSearch: search => dispatch(setSearch(search)),
    fetchMembers: opts => dispatch(fetchMembers(opts)),
    showMember: id => navigation.navigate('MemberProfile', {id}),
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { sortBy, hasMore, pending, slug, search, subject } = stateProps

  // TODO

  const fetchMembers = (offset = 0) =>
    dispatchProps.fetchMembers({ subject, slug, sortBy, offset, search })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchMembers,
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
