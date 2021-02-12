import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'
import getMe from 'store/selectors/getMe'
import getCurrentGroup from 'store/selectors/getCurrentGroup'
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
  const { group, sortBy } = props

  return {
    ...omit(['group', 'sortBy'], props),
    sortBy: sortBy,
    slug: get('slug', group)
  }
}

// these keys must match the values that hylo-node can handle
export function sortKeysFactory () {
  const sortKeys = {
    name: 'Name',
    location: 'Location',
    join: 'Newest'
  }

  return sortKeys
}

export function mapStateToProps (state, props) {
  const currentUser = getMe(state, props)
  const group = getCurrentGroup(state, props)
  const canModerate = currentUser && currentUser.canModerate(group)
  const search = getSearch(state)
  const sortBy = getSort(state)
  const fetchOpts = makeFetchOpts({ group, sortBy, search })
  const { slug } = fetchOpts
  const getOpts = fetchOpts

  getOpts.memberContext = fetchOpts.context

  return {
    currentUser,
    group,
    canModerate,
    fetchOpts,
    hasMore: getHasMoreMembers(state, getOpts),
    members: getMembers(state, getOpts),
    pending: state.pending[FETCH_MEMBERS],
    search,
    slug,
    sortKeys: sortKeysFactory(),
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
  const { hasMore, pending, members, fetchOpts, group } = stateProps
  const fetchMembers = group
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
