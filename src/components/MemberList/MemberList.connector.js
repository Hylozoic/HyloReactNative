import { connect } from 'react-redux'
import { omit, get } from 'lodash/fp'

import { ALL_COMMUNITIES_ID } from '../../store/models/Community'
import {
  FETCH_MEMBERS,
  fetchMembers,
  getHasMoreMembers,
  getMembers
} from './MemberList.store'
import getMe from '../../store/selectors/getMe'
import getCurrentCommunity from '../../store/selectors/getCurrentCommunity'
import getCurrentNetwork from '../../store/selectors/getCurrentNetwork'

export function makeFetchOpts (props) {
  const { community, network } = props

  var subject, slug

  if (network) {
    subject = 'network'
    slug = get('slug', network)
  } else if (community) {
    subject = 'community'
    slug = get('slug', community)
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

  const canModerate = currentUser && currentUser.canModerate(community)

  const fetchOpts = makeFetchOpts({community, network})
  const { slug, subject } = fetchOpts

  const getOpts = omit('subject', fetchOpts)
  getOpts.memberSubject = fetchOpts.subject

  const members = getMembers(state, getOpts)

  console.log('members', members)

  return {
    fetchOpts,
    currentUser,
    community,
    network,
    canModerate,
    hasMore: getHasMoreMembers(state, getOpts),
    members,
    pending: state.pending[FETCH_MEMBERS],
    slug,
    subject,
    isAll: slug === ALL_COMMUNITIES_ID
  }
}

export function mapDispatchToProps (dispatch, { navigation }) {
  return {
    fetchMembers: opts => dispatch(fetchMembers(opts)),
    showMember: id => navigation.navigate({routeName: 'MemberProfile', params: {id}, key: 'MemberProfile'}),
    updateBadges: badgeFlags => navigation.setParams(badgeFlags)
  }
}

export function getSortByParam (sort, fetchOpts) {
  // can't sort network members by join date
  if (fetchOpts.subject === 'network' && sort === 'join') {
    return 'name'
  }
  return sort
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { hasMore, pending, members, fetchOpts, community, network } = stateProps
  const fetchMembers = (community || network)
    ? (search, sort) => dispatchProps.fetchMembers({...fetchOpts, ...{search, sort: getSortByParam(sort, fetchOpts)}})
    : () => {}
  const offset = members.length
  const fetchMoreMembers = hasMore && !pending
    ? (search, sort) => dispatchProps.fetchMembers({ ...fetchOpts, ...{search, sort: getSortByParam(sort, fetchOpts)}, offset })
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
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)
