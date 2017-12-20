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
import getCurrentNetwork from '../../../store/selectors/getCurrentNetwork'

function makeFetchOpts (props) {
  const { community, network } = props

  var subject, slug

  if (community) {
    subject = 'community'
    slug = get('slug', community)
  } else if (network) {
    subject = 'network'
    slug = get('slug', network)
  } else {
    subject = 'all-communities'
    slug = ALL_COMMUNITIES_ID
  }

  return {
    ...omit(['community', 'network'], props),
    subject,
    slug
  }
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)

  const search = getSearch(state)
  const sortBy = getSort(state)

  const fetchOpts = makeFetchOpts({community, network, sortBy, search})
  const { slug } = fetchOpts

  const getOpts = omit('subject', fetchOpts)
  getOpts.memberSubject = fetchOpts.subject

  return {
    fetchOpts,
    currentUser,
    community,
    network,
    hasMore: getHasMoreMembers(state, getOpts),
    members: getMembers(state, getOpts),
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
  const { hasMore, pending, members, community, fetchOpts } = stateProps
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
