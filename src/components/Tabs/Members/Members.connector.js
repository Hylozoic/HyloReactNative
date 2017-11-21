import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'

import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'
import {
  FETCH_MEMBERS,
  fetchMembers,
  getHasMoreMembers,
  getMembers,
  getSearch,
  getSort,
  setSearch,
  setSort
} from './Members.store'
import getMe from '../../../store/selectors/getMe'
import { mapWhenFocused, mergeWhenFocused } from 'util/connector'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'

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
  const community = getCurrentCommunity(state, props)
  const slug = community && community.slug

  const search = getSearch(state)
  const sortBy = getSort(state)

  return {
    currentUser,
    community: getCurrentCommunity(state, props),
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
