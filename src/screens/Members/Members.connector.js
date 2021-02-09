import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'
// import { mapWhenFocused } from 'util/redux'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
import getCurrentNetwork from 'store/selectors/getCurrentNetwork'
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
  const { group, network, sortBy } = props

  let subject, slug, sortByName

  if (network) {
    subject = 'network'
    slug = get('slug', network)
    // can't sort network members by join date
    if (sortBy === 'join') sortByName = 'name'
  } else if (group) {
    subject = 'group'
    slug = get('slug', group)
  }

  return {
    ...omit(['group', 'network', 'sortBy'], props),
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
  const group = getCurrentGroup(state, props)
  const network = getCurrentNetwork(state, props)

  const canModerate = currentUser && currentUser.canModerate(group)
  const search = getSearch(state)
  const sortBy = getSort(state)

  const fetchOpts = makeFetchOpts({ group, network, sortBy, search })
  const { slug, subject } = fetchOpts

  const getOpts = omit('subject', fetchOpts)
  getOpts.memberSubject = fetchOpts.subject

  return {
    currentUser,
    group,
    network,
    canModerate,
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
  const { hasMore, pending, members, fetchOpts, group, network } = stateProps
  const fetchMembers = (group || network)
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
