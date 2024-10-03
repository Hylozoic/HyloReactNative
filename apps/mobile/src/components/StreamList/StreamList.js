import React, { useEffect, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, View, TouchableOpacity } from 'react-native'
import { createSelector } from 'reselect'
import { isEmpty, get } from 'lodash/fp'
import { useIsFocused } from '@react-navigation/native'
import { FETCH_POSTS } from 'store/constants'
import { ALL_GROUP_ID, isContextGroup, MY_CONTEXT_ID, PUBLIC_GROUP_ID } from 'store/models/Group'
import { makeGetQueryResults } from 'store/reducers/queryResults'
import useFetchPostParam from './useFetchPostParam'
import getMe from 'store/selectors/getMe'
import fetchPosts from 'store/actions/fetchPosts'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import updateUserSettings from 'store/actions/updateUserSettings'
import Icon from 'components/Icon'
import ListControl from 'components/ListControl'
import Loading from 'components/Loading'
import PostRow from './PostRow'
import { pictonBlue } from 'style/colors'
import styles from './StreamList.styles'

/* === CONSTANTS === */

// tracks: `hylo-evo/src/components/StreamViewControls/StreamViewControls.js`
export const POST_TYPE_OPTIONS = [
  { id: undefined, label: 'All Posts' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'offer', label: 'Offers' },
  { id: 'project', label: 'Projects' },
  { id: 'proposal', label: 'Proposals' },
  { id: 'request', label: 'Requests' },
  { id: 'resource', label: 'Resources' }
]
// tracks: `hylo/hylo-evo/src/util/constants.js`
export const STREAM_SORT_OPTIONS = [
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'reactions', label: 'Popular' }
]
// tracks: `hylo/hylo-evo/src/util/constants.js`
export const COLLECTION_SORT_OPTIONS = [
  { id: 'order', label: 'Manual' },
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'reactions', label: 'Popular' }
]
// tracks: `hylo-evo/src/routes/Events/Events.js`
export const EVENT_STREAM_TIMEFRAME_OPTIONS = [
  { id: 'future', label: 'Upcoming Events' },
  { id: 'past', label: 'Past Events' }
]
export const DEFAULT_SORT_BY_ID = 'updated'
export const DEFAULT_TIMEFRAME_ID = 'future'

/* === SELECTORS === */

const getPostResults = makeGetQueryResults(FETCH_POSTS)

export const getPostIds = createSelector(
  getPostResults,
  results => isEmpty(results) ? [] : results.ids
)

export const getHasMorePosts = createSelector(getPostResults, get('hasMore'))

/* === COMPONENTS === */

export default function StreamList (props) {
  const {
    customView,
    streamType,
    forGroup,
    header,
    myHome,
    scrollRef,
    topicName
  } = props
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const currentUser = useSelector(getMe)
  const [filter, setFilter] = useState()
  const [sortBy, setSortBy] = useState(
    get('settings.streamSortBy', currentUser) ||
    customView?.defaultSort ||
    DEFAULT_SORT_BY_ID
  )
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME_ID)
  const fetchPostParam = useFetchPostParam({
    customView,
    streamType,
    filter,
    forGroup,
    myHome,
    sortBy,
    timeframe,
    topicName
  })
  const pending = useSelector(state => state.pending[FETCH_POSTS])
  const postIds = useSelector(state => getPostIds(state, fetchPostParam))
  const hasMore = useSelector(state => getHasMorePosts(state, fetchPostParam))

  useEffect(() => {
    if (fetchPostParam && isFocused && isEmpty(postIds) && hasMore !== false) {
      const forGroupId = get('id', forGroup)
      const shouldReset = slug => (
        slug !== ALL_GROUP_ID &&
        slug !== PUBLIC_GROUP_ID &&
        slug !== MY_CONTEXT_ID &&
        !topicName &&
        sortBy === DEFAULT_SORT_BY_ID &&
        !fetchPostParam.filter
      )

      if (shouldReset(fetchPostParam.context)) {
        dispatch(resetNewPostCount(forGroupId, 'Membership'))
      }

      dispatch(fetchPosts(fetchPostParam))
    }
  }, [fetchPostParam, hasMore, isFocused, postIds])

  // Only custom views can be sorted by manual order
  useEffect(() => {
    if (!customView && sortBy === 'order') {
      setSortBy('updated')
    }
  }, [customView, sortBy])

  const refreshPosts = useCallback(() => {
    if (fetchPostParam) {
      dispatch(fetchPosts(fetchPostParam, { reset: true }))
    }
  }, [fetchPostParam])

  const fetchMorePosts = useCallback(() => {
    if (fetchPostParam && hasMore && !pending) {
      dispatch(fetchPosts({
        ...fetchPostParam,
        offset: postIds.length
      }))
    }
  }, [fetchPostParam, hasMore, pending, postIds.length])

  if (!fetchPostParam) return null

  const sortOptions = customView?.type === 'collection'
    ? COLLECTION_SORT_OPTIONS
    : STREAM_SORT_OPTIONS

  const handleChildPostToggle = () => {
    const childPostInclusion = fetchPostParam?.childPostInclusion === 'yes' ? 'no' : 'yes'
    dispatch(updateUserSettings({ settings: { streamChildPosts: childPostInclusion } }))
  }

  const extraToggleStyles = fetchPostParam?.childPostInclusion === 'yes'
    ? { backgroundColor: pictonBlue }
    : { backgroundColor: '#FFFFFF' }

  return (
    <View style={styles.container}>
      <FlatList
        ref={scrollRef}
        data={postIds}
        renderItem={({ item }) => renderPostRow({ ...props, postId: item })}
        onRefresh={refreshPosts}
        refreshing={!!pending}
        keyExtractor={item => `post${item}`}
        onEndReached={fetchMorePosts}
        ListHeaderComponent={
          <View>
            {header}
            {!streamType && (
              <View style={[styles.listControls]}>
                <ListControl selected={sortBy} onChange={setSortBy} options={sortOptions} />
                <View style={styles.steamControlRightSide}>
                  {!['my', 'public'].includes(fetchPostParam?.context) &&
                    <TouchableOpacity onPress={handleChildPostToggle}>
                      <View style={{ ...styles.childGroupToggle, ...extraToggleStyles }}>
                        <Icon name='Subgroup' color={fetchPostParam?.childPostInclusion === 'yes' ? '#FFFFFF' : pictonBlue} />
                      </View>
                    </TouchableOpacity>}
                  {!fetchPostParam?.types && (
                    <ListControl selected={fetchPostParam.filter} onChange={setFilter} options={POST_TYPE_OPTIONS} />
                  )}
                </View>
              </View>
            )}
            {streamType === 'event' && (
              <View style={[styles.listControls]}>
                <ListControl selected={timeframe} onChange={setTimeframe} options={EVENT_STREAM_TIMEFRAME_OPTIONS} />
              </View>
            )}
          </View>
        }
        ListFooterComponent={pending ? <Loading style={styles.loading} /> : null}
      />
    </View>
  )
}

function renderPostRow ({
  postId,
  fetchPostParam,
  forGroup,
  showPost,
  showMember,
  showTopic,
  goToGroup
}) {
  return (
    <PostRow
      context={fetchPostParam?.context}
      postId={postId}
      forGroupId={forGroup?.id}
      showGroups={!forGroup?.id || isContextGroup(forGroup?.slug)}
      showPost={showPost}
      showMember={showMember}
      showTopic={showTopic}
      goToGroup={goToGroup}
    />
  )
}
