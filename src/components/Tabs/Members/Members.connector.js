import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'

import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'
import {
  FETCH_MEMBERS,
  getHasMoreMembers,
  fetchMembers,
  getSort,
  setSort,
  getSearch,
  setSearch,
  getMembers
} from './Members.store'
import getMe from '../../../store/selectors/getMe'
import getCommunity from '../../../store/selectors/getCommunity'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'

function makeFetchOpts (props) {
  const { community } = props

  return {
    ...omit('community', props),
    subject: community ? 'community' : 'all-communities',
    slug: get('slug', community) || ALL_COMMUNITIES_ID
  }
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const communityId = state.currentCommunity ||
    (currentUser && get('id', currentUser.lastViewedCommunity()))
  const community = getCommunity(state, {id: communityId})
  const slug = community && community.slug

  const search = getSearch(state)
  const sortBy = getSort(state)

  return {
    currentUser,
    communityId,
    community,
    hasMore: getHasMoreMembers(state, {slug, search, sortBy}),
    members: getMembers(state, {slug, search, sortBy}),
    pending: state.pending[FETCH_MEMBERS],
    search,
    slug,
    sortBy
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    setSort: sort => dispatch(setSort(sort)),
    setSearch: search => dispatch(setSearch(search)),
    fetchMembers: opts => dispatch(fetchMembers(opts)),
    showMember: id => navigation.navigate('MemberProfile', {id}),
    updateBadges: badgeFlags => navigation.setParams(badgeFlags)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { sortBy, hasMore, pending, search, members, community } = stateProps
  const fetchOpts = makeFetchOpts({community, sortBy, search})
  const fetchMembers = () =>
    !!community && dispatchProps.fetchMembers(fetchOpts)
  const offset = members.length
  const fetchMoreMembers = hasMore && !pending
    ? () => dispatchProps.fetchMembers({ ...fetchOpts, offset })
    : () => {}

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchMoreMembers,
    fetchMembers
  }
}

export default connect(
  mapWhenFocused(mapStateToProps),
  mapDispatchToProps,
  mergeWhenFocused(mergeProps)
)
