import { connect } from 'react-redux'
import getMe from '../../../store/selectors/getMe'
import { FETCH_MEMBERS, getHasMoreMembers, fetchMembers, getSort, setSort, getSearch, setSearch, getMembers } from './Members.store'
import getCurrentCommunity from '../../../store/selectors/getCurrentCommunity'
import { ALL_COMMUNITIES_ID } from '../../../store/models/Community'
import { omit, get } from 'lodash/fp'

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
    slug,
    search,
    sortBy,
    members: getMembers(state, {slug, search, sortBy}),
    hasMore: getHasMoreMembers(state, {slug, search, sortBy}),
    pending: state.pending[FETCH_MEMBERS]
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
