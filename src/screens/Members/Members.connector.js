import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'
// import { mapWhenFocused } from 'util/redux'
import getMe from 'store/selectors/getMe'
import getCurrentCommunity from 'store/selectors/getCurrentCommunity'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'
import { ALL_COMMUNITIES_ID } from 'routing/helpers'
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

export function makeFetchOpts (props) {
  const { community, network, sortBy } = props

  let subject, slug, sortByName

  if (network) {
    subject = 'network'
    slug = get('slug', network)
    // can't sort network members by join date
    if (sortBy === 'join') sortByName = 'name'
  } else if (community) {
    subject = 'community'
    slug = get('slug', community)
  } else {
    subject = ALL_COMMUNITIES_ID
    slug = ALL_COMMUNITIES_ID
  }

  return {
    ...omit(['community', 'network', 'sortBy'], props),
    sortBy: sortByName || sortBy,
    subject,
    slug
  }
}

// these keys must match the values that hylo-node can handle
export function sortKeysFactory (subject) {
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  if (subject !== 'network') sortKeys.join = 'Newest'
  return sortKeys
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const community = getCurrentCommunity(state, props)
  const network = getCurrentNetwork(state, props)

  const canModerate = currentUser && currentUser.canModerate(community)
  const search = getSearch(state)
  const sortBy = getSort(state)

  const fetchOpts = makeFetchOpts({ community, network, sortBy, search })
  const { slug, subject } = fetchOpts

  const getOpts = omit('subject', fetchOpts)
  getOpts.memberSubject = fetchOpts.subject

  return {
    currentUser,
    community,
    network,
    canModerate,
    isAll: slug === ALL_COMMUNITIES_ID,
    subject,
    fetchOpts,
    hasMore: getHasMoreMembers(state, getOpts),
    members: getMembers(state, getOpts),
    pending: state.pending[FETCH_MEMBERS],
    search,
    slug,
    sortKeys: sortKeysFactory(subject),
    // Use the sortBy that has been adjusted in the case of networks (see makeFetchOpts)
    sortBy: fetchOpts.sortBy
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    showMember: id => props.navigation.navigate('Member', { id }),
    setSort: sort => dispatch(setSort(sort)),
    setSearch: search => dispatch(setSearch(search)),
    fetchMembers: opts => dispatch(fetchMembers(opts))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, members, fetchOpts, community, network } = stateProps
  const fetchMembers = (community || network)
    ? () => dispatchProps.fetchMembers(fetchOpts)
    : () => {}
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
